# Data Model: Water Calendar

## WaterEvent Entity

### Database Schema

```sql
CREATE TABLE water_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'WATERED', 'POSTPONED', 'SKIPPED')),
  completed_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for efficient queries by plant and date range
CREATE INDEX idx_water_events_plant_id ON water_events(plant_id);
CREATE INDEX idx_water_events_scheduled_date ON water_events(scheduled_date);
CREATE INDEX idx_water_events_status ON water_events(status);

-- Composite index for overdue queries
CREATE INDEX idx_water_events_overdue ON water_events(scheduled_date, status)
  WHERE status = 'PENDING';
```

### TypeScript Entity (Backend)

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Plant } from '../plants/plant.entity';

export enum WaterEventStatus {
  PENDING = 'PENDING',
  WATERED = 'WATERED',
  POSTPONED = 'POSTPONED',
  SKIPPED = 'SKIPPED',
}

@Entity('water_events')
export class WaterEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  plantId: string;

  @ManyToOne(() => Plant, { onDelete: 'CASCADE' })
  plant: Plant;

  @Column('timestamp')
  scheduledDate: Date;

  @Column({
    type: 'enum',
    enum: WaterEventStatus,
    default: WaterEventStatus.PENDING,
  })
  status: WaterEventStatus;

  @Column('timestamp', { nullable: true })
  completedDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### TypeScript Types (Frontend)

```typescript
export enum WaterEventStatus {
  PENDING = 'PENDING',
  WATERED = 'WATERED',
  POSTPONED = 'POSTPONED',
  SKIPPED = 'SKIPPED',
}

export interface WaterEvent {
  id: string;
  plantId: string;
  plant?: Plant; // Populated in some queries
  scheduledDate: string; // ISO 8601 date string
  status: WaterEventStatus;
  completedDate?: string; // ISO 8601 date string
  createdAt: string;
  updatedAt: string;
}

export interface WaterEventWithPlant extends WaterEvent {
  plant: {
    id: string;
    name: string;
    location?: string;
    photos: string[];
    species?: {
      commonName: string;
      waterPreference: 'LOW' | 'MEDIUM' | 'HIGH';
    };
  };
}

export interface CreateWaterEventDto {
  plantId: string;
  scheduledDate: string; // ISO 8601 date string
}

export interface CompleteWaterEventDto {
  status: 'WATERED' | 'POSTPONED';
  completedDate: string; // ISO 8601 date string
}
```

## Water Check Interval Rules

### Calculation Logic

```typescript
export enum WaterPreference {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export const WATER_CHECK_INTERVALS = {
  [WaterPreference.HIGH]: 4,    // days
  [WaterPreference.MEDIUM]: 14, // days
  [WaterPreference.LOW]: 30,    // days
  DEFAULT: 14,                   // days (for plants without species)
} as const;

export const POSTPONE_INTERVALS = {
  [WaterPreference.HIGH]: 2,    // days
  [WaterPreference.MEDIUM]: 5,  // days
  [WaterPreference.LOW]: 10,    // days
  DEFAULT: 5,                    // days (for plants without species)
} as const;

/**
 * Calculate the next water check date based on water preference
 */
export function calculateNextWaterCheckDate(
  lastCheckDate: Date,
  waterPreference: WaterPreference | null
): Date {
  const interval = waterPreference
    ? WATER_CHECK_INTERVALS[waterPreference]
    : WATER_CHECK_INTERVALS.DEFAULT;

  const nextDate = new Date(lastCheckDate);
  nextDate.setDate(nextDate.getDate() + interval);

  return nextDate;
}

/**
 * Calculate postponed date based on water preference
 */
export function calculatePostponedDate(
  scheduledDate: Date,
  waterPreference: WaterPreference | null
): Date {
  const postponeInterval = waterPreference
    ? POSTPONE_INTERVALS[waterPreference]
    : POSTPONE_INTERVALS.DEFAULT;

  const postponedDate = new Date(scheduledDate);
  postponedDate.setDate(postponedDate.getDate() + postponeInterval);

  return postponedDate;
}
```

## Database Relationships

```
User (1) ----< (M) Plant (1) ----< (M) WaterEvent
                  |
                  |
                  v
            PlantSpecies (M:1)
```

### Relationship Details

- **Plant → WaterEvent**: One-to-Many
  - One plant has many water events (past and future)
  - Cascade delete: When plant is deleted, all its water events are deleted

- **Plant → PlantSpecies**: Many-to-One (optional)
  - Plant may reference a species (or null if no species assigned)
  - Species provides the `waterPreference` field used for scheduling

## Query Patterns

### Get Events for Date Range (Calendar Month)

```typescript
// GET /api/v1/water-events?startDate=2025-12-01&endDate=2025-12-31
async getEventsForDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<WaterEventWithPlant[]> {
  return await this.waterEventRepository
    .createQueryBuilder('event')
    .leftJoinAndSelect('event.plant', 'plant')
    .leftJoinAndSelect('plant.species', 'species')
    .where('plant.userId = :userId', { userId })
    .andWhere('event.scheduledDate BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    })
    .orderBy('event.scheduledDate', 'ASC')
    .getMany();
}
```

### Get Overdue Events

```typescript
// GET /api/v1/water-events/overdue
async getOverdueEvents(userId: string): Promise<WaterEventWithPlant[]> {
  const now = new Date();

  return await this.waterEventRepository
    .createQueryBuilder('event')
    .leftJoinAndSelect('event.plant', 'plant')
    .leftJoinAndSelect('plant.species', 'species')
    .where('plant.userId = :userId', { userId })
    .andWhere('event.scheduledDate < :now', { now })
    .andWhere('event.status = :status', { status: WaterEventStatus.PENDING })
    .orderBy('event.scheduledDate', 'ASC')
    .getMany();
}
```

### Create Initial Water Event (on Plant Creation)

```typescript
async createInitialWaterEvent(plant: Plant): Promise<WaterEvent> {
  const waterPreference = plant.species?.waterPreference || null;
  const scheduledDate = calculateNextWaterCheckDate(
    plant.acquisitionDate,
    waterPreference
  );

  const waterEvent = this.waterEventRepository.create({
    plantId: plant.id,
    scheduledDate,
    status: WaterEventStatus.PENDING,
  });

  return await this.waterEventRepository.save(waterEvent);
}
```

### Complete Water Event and Create Next

```typescript
async completeWaterEvent(
  eventId: string,
  dto: CompleteWaterEventDto
): Promise<{ completed: WaterEvent; next?: WaterEvent }> {
  const event = await this.waterEventRepository.findOne({
    where: { id: eventId },
    relations: ['plant', 'plant.species'],
  });

  if (!event) {
    throw new NotFoundException('Water event not found');
  }

  // Update current event
  event.status = dto.status === 'WATERED'
    ? WaterEventStatus.WATERED
    : WaterEventStatus.POSTPONED;
  event.completedDate = new Date(dto.completedDate);

  await this.waterEventRepository.save(event);

  // Create next event
  let nextEvent: WaterEvent | undefined;

  if (dto.status === 'WATERED') {
    // Create next check based on base interval
    const waterPreference = event.plant.species?.waterPreference || null;
    const nextDate = calculateNextWaterCheckDate(
      event.scheduledDate,
      waterPreference
    );

    nextEvent = await this.waterEventRepository.save({
      plantId: event.plantId,
      scheduledDate: nextDate,
      status: WaterEventStatus.PENDING,
    });
  } else if (dto.status === 'POSTPONED') {
    // Create postponed check
    const waterPreference = event.plant.species?.waterPreference || null;
    const postponedDate = calculatePostponedDate(
      event.scheduledDate,
      waterPreference
    );

    nextEvent = await this.waterEventRepository.save({
      plantId: event.plantId,
      scheduledDate: postponedDate,
      status: WaterEventStatus.PENDING,
    });
  }

  return { completed: event, next: nextEvent };
}
```

### Recalculate Events on Species Change

```typescript
async recalculateEventsForPlant(plantId: string): Promise<void> {
  const plant = await this.plantRepository.findOne({
    where: { id: plantId },
    relations: ['species'],
  });

  if (!plant) {
    throw new NotFoundException('Plant not found');
  }

  // Get the most recent completed water event
  const lastCompletedEvent = await this.waterEventRepository.findOne({
    where: {
      plantId,
      status: In([WaterEventStatus.WATERED, WaterEventStatus.POSTPONED]),
    },
    order: { completedDate: 'DESC' },
  });

  // Delete all future pending events
  await this.waterEventRepository.delete({
    plantId,
    status: WaterEventStatus.PENDING,
    scheduledDate: MoreThan(new Date()),
  });

  // Create new event based on new species preference
  const waterPreference = plant.species?.waterPreference || null;
  const baseDate = lastCompletedEvent?.completedDate || plant.acquisitionDate;
  const nextDate = calculateNextWaterCheckDate(baseDate, waterPreference);

  await this.waterEventRepository.save({
    plantId,
    scheduledDate: nextDate,
    status: WaterEventStatus.PENDING,
  });
}
```

## Data Migration

Since this is a new feature, no migration from existing data is needed. The water events will be created:

1. **For new plants**: Automatically when plant is created
2. **For existing plants**: Run a one-time migration script:

```typescript
async function migrateExistingPlants() {
  const plants = await plantRepository.find({ relations: ['species'] });

  for (const plant of plants) {
    const waterPreference = plant.species?.waterPreference || null;
    const scheduledDate = calculateNextWaterCheckDate(
      plant.acquisitionDate,
      waterPreference
    );

    await waterEventRepository.save({
      plantId: plant.id,
      scheduledDate,
      status: WaterEventStatus.PENDING,
    });
  }

  console.log(`Created water events for ${plants.length} existing plants`);
}
```
