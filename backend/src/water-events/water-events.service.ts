import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import { WaterEvent, WaterEventStatus } from './entities/water-event.entity';
import { Plant } from '../plants/entities/plant.entity';
import { PlantSpecies } from '../plant-species/entities/plant-species.entity';
import { WaterPreference } from '../plant-species/entities/plant-species.entity';
import { CompleteWaterEventDto, WaterEventAction } from './dto/complete-water-event.dto';
import { CreateWaterEventDto } from './dto/create-water-event.dto';

@Injectable()
export class WaterEventsService {
  constructor(
    @InjectRepository(WaterEvent)
    private readonly waterEventRepository: Repository<WaterEvent>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @InjectRepository(PlantSpecies)
    private readonly plantSpeciesRepository: Repository<PlantSpecies>,
  ) {}

  /**
   * Get watering interval in days based on water preference
   */
  private getWateringInterval(waterPreference: WaterPreference): number {
    const intervals = {
      [WaterPreference.HIGH]: 4,
      [WaterPreference.MEDIUM]: 14,
      [WaterPreference.LOW]: 30,
    };
    return intervals[waterPreference];
  }

  /**
   * Get postpone interval in days based on water preference
   */
  private getPostponeInterval(waterPreference: WaterPreference): number {
    const intervals = {
      [WaterPreference.HIGH]: 2,
      [WaterPreference.MEDIUM]: 5,
      [WaterPreference.LOW]: 10,
    };
    return intervals[waterPreference];
  }

  /**
   * Calculate next scheduled date based on water preference
   */
  private calculateNextScheduledDate(
    fromDate: Date,
    waterPreference: WaterPreference,
  ): Date {
    const interval = this.getWateringInterval(waterPreference);
    const nextDate = new Date(fromDate);
    nextDate.setDate(nextDate.getDate() + interval);
    return nextDate;
  }

  /**
   * Calculate postponed date based on water preference
   */
  private calculatePostponedDate(
    fromDate: Date,
    waterPreference: WaterPreference,
  ): Date {
    const interval = this.getPostponeInterval(waterPreference);
    const postponedDate = new Date(fromDate);
    postponedDate.setDate(postponedDate.getDate() + interval);
    return postponedDate;
  }

  /**
   * Create initial water event for a plant from acquisition date
   */
  async createInitialWaterEvent(plant: Plant): Promise<WaterEvent> {
    // Load species if not already loaded
    if (!plant.species && plant.speciesId) {
      const species = await this.plantSpeciesRepository.findOne({
        where: { id: plant.speciesId },
      });
      if (species) {
        plant.species = species;
      }
    }

    // If no species, we can't create a water event
    if (!plant.species) {
      throw new BadRequestException(
        'Cannot create water event for plant without species',
      );
    }

    // Use acquisition date or current date as starting point
    const startDate = plant.acquisitionDate || new Date();
    const scheduledDate = this.calculateNextScheduledDate(
      startDate,
      plant.species.waterPreference,
    );

    const waterEvent = this.waterEventRepository.create({
      plantId: plant.id,
      scheduledDate,
      status: WaterEventStatus.PENDING,
    });

    return this.waterEventRepository.save(waterEvent);
  }

  /**
   * Get water events for a specific date range
   */
  async getEventsForDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<WaterEvent[]> {
    return this.waterEventRepository
      .createQueryBuilder('waterEvent')
      .innerJoin('waterEvent.plant', 'plant')
      .leftJoinAndSelect('waterEvent.plant', 'plantData')
      .where('plant.userId = :userId', { userId })
      .andWhere('waterEvent.scheduledDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('waterEvent.scheduledDate', 'ASC')
      .getMany();
  }

  /**
   * Get overdue water events (pending events before today)
   */
  async getOverdueEvents(userId: string): Promise<WaterEvent[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.waterEventRepository
      .createQueryBuilder('waterEvent')
      .innerJoin('waterEvent.plant', 'plant')
      .leftJoinAndSelect('waterEvent.plant', 'plantData')
      .where('plant.userId = :userId', { userId })
      .andWhere('waterEvent.status = :status', {
        status: WaterEventStatus.PENDING,
      })
      .andWhere('waterEvent.scheduledDate < :today', { today })
      .orderBy('waterEvent.scheduledDate', 'ASC')
      .getMany();
  }

  /**
   * Complete a water event (mark as watered/postponed/skipped)
   */
  async completeWaterEvent(
    eventId: string,
    userId: string,
    dto: CompleteWaterEventDto,
  ): Promise<WaterEvent> {
    // Find the event and verify ownership
    const waterEvent = await this.waterEventRepository.findOne({
      where: { id: eventId },
      relations: ['plant', 'plant.species'],
    });

    if (!waterEvent) {
      throw new NotFoundException(`Water event with ID ${eventId} not found`);
    }

    if (waterEvent.plant.userId !== userId) {
      throw new ForbiddenException('You do not have access to this water event');
    }

    // Update the event status
    const completedDate = dto.completedDate
      ? new Date(dto.completedDate)
      : new Date();

    switch (dto.action) {
      case WaterEventAction.WATERED:
        waterEvent.status = WaterEventStatus.WATERED;
        waterEvent.completedDate = completedDate;
        await this.waterEventRepository.save(waterEvent);

        // Create next water event
        if (waterEvent.plant.species) {
          const nextScheduledDate = this.calculateNextScheduledDate(
            completedDate,
            waterEvent.plant.species.waterPreference,
          );

          await this.waterEventRepository.save(
            this.waterEventRepository.create({
              plantId: waterEvent.plantId,
              scheduledDate: nextScheduledDate,
              status: WaterEventStatus.PENDING,
            }),
          );
        }
        break;

      case WaterEventAction.POSTPONED:
        waterEvent.status = WaterEventStatus.POSTPONED;
        waterEvent.completedDate = completedDate;
        await this.waterEventRepository.save(waterEvent);

        // Create postponed event from today + postpone interval
        if (waterEvent.plant.species) {
          const postponedDate = this.calculatePostponedDate(
            completedDate,
            waterEvent.plant.species.waterPreference,
          );

          await this.waterEventRepository.save(
            this.waterEventRepository.create({
              plantId: waterEvent.plantId,
              scheduledDate: postponedDate,
              status: WaterEventStatus.PENDING,
            }),
          );
        }
        break;
    }

    return waterEvent;
  }

  /**
   * Recalculate water events for a plant (when species changes)
   */
  async recalculateEventsForPlant(plantId: string): Promise<void> {
    const plant = await this.plantRepository.findOne({
      where: { id: plantId },
      relations: ['species'],
    });

    if (!plant) {
      throw new NotFoundException(`Plant with ID ${plantId} not found`);
    }

    if (!plant.species) {
      // If no species, delete all pending events
      await this.waterEventRepository.delete({
        plantId,
        status: WaterEventStatus.PENDING,
      });
      return;
    }

    // Delete all pending future events
    await this.waterEventRepository.delete({
      plantId,
      status: WaterEventStatus.PENDING,
    });

    // Find the last completed event (watered)
    const lastWateredEvent = await this.waterEventRepository.findOne({
      where: {
        plantId,
        status: WaterEventStatus.WATERED,
      },
      order: { completedDate: 'DESC' },
    });

    // Calculate next scheduled date
    const baseDate = lastWateredEvent?.completedDate || plant.acquisitionDate || new Date();
    const nextScheduledDate = this.calculateNextScheduledDate(
      baseDate,
      plant.species.waterPreference,
    );

    // Create new pending event
    await this.waterEventRepository.save(
      this.waterEventRepository.create({
        plantId,
        scheduledDate: nextScheduledDate,
        status: WaterEventStatus.PENDING,
      }),
    );
  }

  /**
   * Manually create a water event
   */
  async create(
    userId: string,
    createWaterEventDto: CreateWaterEventDto,
  ): Promise<WaterEvent> {
    // Verify plant ownership
    const plant = await this.plantRepository.findOne({
      where: { id: createWaterEventDto.plantId, userId },
    });

    if (!plant) {
      throw new NotFoundException(
        `Plant with ID ${createWaterEventDto.plantId} not found`,
      );
    }

    const waterEvent = this.waterEventRepository.create({
      plantId: createWaterEventDto.plantId,
      scheduledDate: new Date(createWaterEventDto.scheduledDate),
      status: WaterEventStatus.PENDING,
    });

    return this.waterEventRepository.save(waterEvent);
  }

  /**
   * Find a single water event
   */
  async findOne(id: string, userId: string): Promise<WaterEvent> {
    const waterEvent = await this.waterEventRepository.findOne({
      where: { id },
      relations: ['plant'],
    });

    if (!waterEvent) {
      throw new NotFoundException(`Water event with ID ${id} not found`);
    }

    if (waterEvent.plant.userId !== userId) {
      throw new ForbiddenException('You do not have access to this water event');
    }

    return waterEvent;
  }
}
