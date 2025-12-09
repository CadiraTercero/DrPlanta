import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlantSpecies } from './entities/plant-species.entity';

@Injectable()
export class PlantSpeciesService {
  constructor(
    @InjectRepository(PlantSpecies)
    private readonly plantSpeciesRepository: Repository<PlantSpecies>,
  ) {}

  async search(query: string, limit: number = 10): Promise<PlantSpecies[]> {
    // Case-insensitive search in both commonName and latinName
    // Partial matching with LIKE
    const results = await this.plantSpeciesRepository
      .createQueryBuilder('species')
      .where(
        'LOWER(species.commonName) LIKE LOWER(:searchTerm) OR LOWER(species.latinName) LIKE LOWER(:searchTerm)',
        { searchTerm: `%${query}%` },
      )
      .orderBy('species.commonName', 'ASC')
      .limit(limit)
      .getMany();

    return results;
  }

  async findAll(): Promise<PlantSpecies[]> {
    return this.plantSpeciesRepository.find({
      order: { commonName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<PlantSpecies | null> {
    return this.plantSpeciesRepository.findOne({
      where: { id },
    });
  }
}
