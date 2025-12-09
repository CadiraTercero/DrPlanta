import { IsUUID, IsDateString } from 'class-validator';

export class CreateWaterEventDto {
  @IsUUID()
  plantId: string;

  @IsDateString()
  scheduledDate: string;
}
