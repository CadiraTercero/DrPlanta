import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlantsModule } from './plants/plants.module';
import { PlantSpeciesModule } from './plant-species/plant-species.module';
import { UploadsModule } from './uploads/uploads.module';
import { WaterEventsModule } from './water-events/water-events.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    PlantsModule,
    PlantSpeciesModule,
    UploadsModule,
    WaterEventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
