import { Expose, Type } from 'class-transformer';

export class WaterEventPlantDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  location: string;

  @Expose()
  photos: string[];

  @Expose()
  speciesId: string;
}

export class WaterEventResponseDto {
  @Expose()
  id: string;

  @Expose()
  plantId: string;

  @Expose()
  @Type(() => WaterEventPlantDto)
  plant: WaterEventPlantDto;

  @Expose()
  scheduledDate: Date;

  @Expose()
  status: string;

  @Expose()
  completedDate: Date | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
