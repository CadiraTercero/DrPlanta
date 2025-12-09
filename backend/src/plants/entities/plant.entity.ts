import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { PlantSpecies } from '../../plant-species/entities/plant-species.entity';

@Entity('plants')
export class Plant extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  acquisitionDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'simple-array', nullable: true })
  photos: string[];

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => PlantSpecies, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'species_id' })
  species: PlantSpecies;

  @Column({ name: 'species_id', nullable: true })
  speciesId: string;
}
