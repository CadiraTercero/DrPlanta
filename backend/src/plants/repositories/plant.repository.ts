import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Plant } from '../entities/plant.entity';

@Injectable()
export class PlantRepository extends Repository<Plant> {
  constructor(private dataSource: DataSource) {
    super(Plant, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<Plant[]> {
    return this.find({
      where: { userId },
      relations: ['species'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Plant | null> {
    return this.findOne({
      where: { id, userId },
      relations: ['species'],
    });
  }

  async searchByNameOrLocation(
    userId: string,
    searchTerm: string,
  ): Promise<Plant[]> {
    return this.createQueryBuilder('plant')
      .leftJoinAndSelect('plant.species', 'species')
      .where('plant.user_id = :userId', { userId })
      .andWhere(
        '(LOWER(plant.name) LIKE LOWER(:searchTerm) OR LOWER(plant.location) LIKE LOWER(:searchTerm))',
        { searchTerm: `%${searchTerm}%` },
      )
      .orderBy('plant.createdAt', 'DESC')
      .getMany();
  }

  async countByUserId(userId: string): Promise<number> {
    return this.count({ where: { userId } });
  }
}
