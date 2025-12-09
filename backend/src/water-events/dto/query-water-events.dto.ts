import { IsDateString } from 'class-validator';

export class QueryWaterEventsDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
