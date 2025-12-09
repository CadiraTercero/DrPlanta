import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantSpecies } from './entities/plant-species.entity';
import { PlantSpeciesService } from './plant-species.service';
import { PlantSpeciesController } from './plant-species.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlantSpecies])],
  controllers: [PlantSpeciesController],
  providers: [PlantSpeciesService],
  exports: [PlantSpeciesService],
})
export class PlantSpeciesModule {}
