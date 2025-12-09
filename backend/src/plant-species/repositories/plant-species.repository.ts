import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlantSpecies } from '../entities/plant-species.entity';

@Injectable()
export class PlantSpeciesRepository extends Repository<PlantSpecies> {
  constructor(private dataSource: DataSource) {
    super(PlantSpecies, dataSource.createEntityManager());
  }

  async findByCommonName(commonName: string): Promise<PlantSpecies | null> {
    return this.findOne({ where: { commonName } });
  }

  async findByDifficulty(difficulty: string): Promise<PlantSpecies[]> {
    return this.find({ where: { difficulty: difficulty as any } });
  }

  async findRecommendedIndoor(): Promise<PlantSpecies[]> {
    return this.find({ where: { recommendedIndoor: true } });
  }

  async findByTags(tags: string[]): Promise<PlantSpecies[]> {
    const query = this.createQueryBuilder('plant_species');

    tags.forEach((tag, index) => {
      if (index === 0) {
        query.where('plant_species.tags LIKE :tag0', { tag0: `%${tag}%` });
      } else {
        query.orWhere(`plant_species.tags LIKE :tag${index}`, { [`tag${index}`]: `%${tag}%` });
      }
    });

    return query.getMany();
  }
}
