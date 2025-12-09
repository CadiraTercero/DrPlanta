import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterEventsService } from './water-events.service';
import { WaterEventsController } from './water-events.controller';
import { WaterEvent } from './entities/water-event.entity';
import { Plant } from '../plants/entities/plant.entity';
import { PlantSpecies } from '../plant-species/entities/plant-species.entity';
import { PlantsModule } from '../plants/plants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WaterEvent, Plant, PlantSpecies]),
    forwardRef(() => PlantsModule),
  ],
  controllers: [WaterEventsController],
  providers: [WaterEventsService],
  exports: [WaterEventsService],
})
export class WaterEventsModule {}
