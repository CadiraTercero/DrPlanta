import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';

export enum LightPreference {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum WaterPreference {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum HumidityPreference {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum Toxicity {
  NON_TOXIC = 'NON_TOXIC',
  TOXIC_PETS = 'TOXIC_PETS',
  TOXIC_HUMANS = 'TOXIC_HUMANS',
  TOXIC_PETS_AND_HUMANS = 'TOXIC_PETS_AND_HUMANS',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

@Entity('plant_species')
export class PlantSpecies extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  commonName: string;

  @Column({ type: 'varchar', length: 255 })
  latinName: string;

  @Column({
    type: 'enum',
    enum: LightPreference,
  })
  lightPreference: LightPreference;

  @Column({
    type: 'enum',
    enum: WaterPreference,
  })
  waterPreference: WaterPreference;

  @Column({
    type: 'enum',
    enum: HumidityPreference,
  })
  humidityPreference: HumidityPreference;

  @Column({
    type: 'enum',
    enum: Toxicity,
  })
  toxicity: Toxicity;

  @Column({
    type: 'enum',
    enum: Difficulty,
  })
  difficulty: Difficulty;

  @Column({ type: 'boolean', default: true })
  recommendedIndoor: boolean;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'text' })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
