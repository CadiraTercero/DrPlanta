import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: 'user' })
  role: string;
}
