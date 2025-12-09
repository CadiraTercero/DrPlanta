import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { Plant } from '../../plants/entities/plant.entity';

export enum WaterEventStatus {
  PENDING = 'PENDING',
  WATERED = 'WATERED',
  POSTPONED = 'POSTPONED',
}

@Entity('water_events')
export class WaterEvent extends BaseEntity {
  @Column({ name: 'plant_id' })
  plantId: string;

  @ManyToOne(() => Plant, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plant_id' })
  plant: Plant;

  @Column({ type: 'timestamp', name: 'scheduled_date' })
  scheduledDate: Date;

  @Column({
    type: 'enum',
    enum: WaterEventStatus,
    default: WaterEventStatus.PENDING,
  })
  status: WaterEventStatus;

  @Column({ type: 'timestamp', name: 'completed_date', nullable: true })
  completedDate: Date | null;
}
