import api from './api';
import { WaterEvent, CompleteWaterEventDto } from '../types/water-event';

export const waterEventService = {
  /**
   * Get water events for a specific date range
   */
  async getEventsForDateRange(startDate: string, endDate: string): Promise<WaterEvent[]> {
    const response = await api.get<WaterEvent[]>('/water-events', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /**
   * Get all overdue water events
   */
  async getOverdueEvents(): Promise<WaterEvent[]> {
    const response = await api.get<WaterEvent[]>('/water-events/overdue');
    return response.data;
  },

  /**
   * Get a single water event by ID
   */
  async getWaterEvent(id: string): Promise<WaterEvent> {
    const response = await api.get<WaterEvent>(`/water-events/${id}`);
    return response.data;
  },

  /**
   * Complete a water event (mark as watered, postponed, or skipped)
   */
  async completeWaterEvent(id: string, data: CompleteWaterEventDto): Promise<WaterEvent> {
    const response = await api.patch<WaterEvent>(`/water-events/${id}/complete`, data);
    return response.data;
  },
};
