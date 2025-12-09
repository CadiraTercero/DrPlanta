import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from './entities/plant.entity';
import { WaterEventsService } from '../water-events/water-events.service';

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @Inject(forwardRef(() => WaterEventsService))
    private readonly waterEventsService: WaterEventsService,
  ) {}

  async create(userId: string, createPlantDto: CreatePlantDto): Promise<Plant> {
    const plant = this.plantRepository.create({
      ...createPlantDto,
      userId,
      acquisitionDate: createPlantDto.acquisitionDate
        ? new Date(createPlantDto.acquisitionDate)
        : null,
    } as any);
    const savedPlant = (await this.plantRepository.save(plant)) as unknown as Plant;

    // Auto-create initial water event if plant has a species
    if (savedPlant.speciesId) {
      try {
        // Load species relation if not already loaded
        const plantWithSpecies = await this.plantRepository.findOne({
          where: { id: savedPlant.id },
          relations: ['species'],
        });
        if (plantWithSpecies && plantWithSpecies.species) {
          await this.waterEventsService.createInitialWaterEvent(plantWithSpecies);
        }
      } catch (error) {
        // Log error but don't fail plant creation if water event fails
        console.error('Failed to create initial water event:', error);
      }
    }

    return savedPlant;
  }

  async findAll(userId: string): Promise<Plant[]> {
    return this.plantRepository.find({
      where: { userId },
      relations: ['species'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Plant> {
    const plant = await this.plantRepository.findOne({
      where: { id, userId },
      relations: ['species'],
    });
    if (!plant) {
      throw new NotFoundException(`Plant with ID ${id} not found`);
    }
    return plant;
  }

  async search(userId: string, searchTerm: string): Promise<Plant[]> {
    return this.plantRepository
      .createQueryBuilder('plant')
      .leftJoinAndSelect('plant.species', 'species')
      .where('plant.userId = :userId', { userId })
      .andWhere(
        '(LOWER(plant.name) LIKE LOWER(:searchTerm) OR LOWER(plant.location) LIKE LOWER(:searchTerm))',
        { searchTerm: `%${searchTerm}%` },
      )
      .orderBy('plant.createdAt', 'DESC')
      .getMany();
  }

  async update(
    id: string,
    userId: string,
    updatePlantDto: UpdatePlantDto,
  ): Promise<Plant> {
    const plant = await this.findOne(id, userId);
    const previousSpeciesId = plant.speciesId;

    Object.assign(plant, {
      ...updatePlantDto,
      acquisitionDate: updatePlantDto.acquisitionDate
        ? new Date(updatePlantDto.acquisitionDate)
        : plant.acquisitionDate,
    } as any);

    const updatedPlant = await this.plantRepository.save(plant);

    // Recalculate water events if species changed
    if (updatePlantDto.speciesId && updatePlantDto.speciesId !== previousSpeciesId) {
      try {
        await this.waterEventsService.recalculateEventsForPlant(updatedPlant.id);
      } catch (error) {
        // Log error but don't fail plant update if water event recalculation fails
        console.error('Failed to recalculate water events:', error);
      }
    }

    return updatedPlant;
  }

  async remove(id: string, userId: string): Promise<void> {
    const plant = await this.findOne(id, userId);
    await this.plantRepository.remove(plant);
  }
}
