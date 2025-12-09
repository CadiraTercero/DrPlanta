import { IsEnum, IsDateString, IsOptional } from 'class-validator';

export enum WaterEventAction {
  WATERED = 'WATERED',
  POSTPONED = 'POSTPONED',
}

export class CompleteWaterEventDto {
  @IsEnum(WaterEventAction)
  action: WaterEventAction;

  @IsOptional()
  @IsDateString()
  completedDate?: string;
}
