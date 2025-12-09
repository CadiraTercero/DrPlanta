import { Plant } from './plant';

export enum WaterEventStatus {
  PENDING = 'PENDING',
  WATERED = 'WATERED',
  POSTPONED = 'POSTPONED',
}

export interface WaterEvent {
  id: string;
  plantId: string;
  plant?: Plant;
  scheduledDate: string;
  status: WaterEventStatus;
  completedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompleteWaterEventDto {
  action: WaterEventStatus.WATERED | WaterEventStatus.POSTPONED;
  completedDate?: string;
}

export interface QueryWaterEventsDto {
  startDate: string;
  endDate: string;
}
