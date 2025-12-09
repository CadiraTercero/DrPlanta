import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { Plant } from './entities/plant.entity';
import { WaterEventsModule } from '../water-events/water-events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plant]),
    forwardRef(() => WaterEventsModule),
  ],
  controllers: [PlantsController],
  providers: [PlantsService],
  exports: [PlantsService],
})
export class PlantsModule {}
