import api from './api';
import { WaterEvent, CompleteWaterEventDto, WaterEventStatus } from '../types/water-event';
import { isGuestMode, getGuestWaterEvents, setGuestWaterEvents } from '../utils/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

/**
 * Local Water Event type for guest mode storage
 */
interface LocalWaterEvent extends WaterEvent {
  localCreatedAt?: string;
  syncedToBackend?: boolean;
}

export const waterEventService = {
  /**
   * Get water events for a specific date range
   */
  async getEventsForDateRange(startDate: string, endDate: string): Promise<WaterEvent[]> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Filter events from local storage by date range
      const localEvents = await getGuestWaterEvents<LocalWaterEvent>();
      console.log(`[getEventsForDateRange] Total events in storage: ${localEvents.length}`);
      console.log(`[getEventsForDateRange] Querying range: ${startDate} to ${endDate}`);
      console.log(`[getEventsForDateRange] All events:`, localEvents.map(e => ({
        id: e.id,
        scheduledDate: e.scheduledDate,
        status: e.status,
      })));

      const start = new Date(startDate);
      const end = new Date(endDate);

      console.log(`[getEventsForDateRange] Start date object:`, start);
      console.log(`[getEventsForDateRange] End date object:`, end);

      const filtered = localEvents.filter(event => {
        const eventDate = new Date(event.scheduledDate);
        const inRange = eventDate >= start && eventDate <= end;
        console.log(`[getEventsForDateRange] Event ${event.scheduledDate}: eventDate=${eventDate}, inRange=${inRange}`);
        return inRange;
      });

      console.log(`[getEventsForDateRange] Filtered ${filtered.length} events`);

      // Populate plant relationship for each event
      return this.populatePlantRelations(filtered);
    }

    // Get events from API
    const response = await api.get<WaterEvent[]>('/water-events', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /**
   * Get all overdue water events
   */
  async getOverdueEvents(): Promise<WaterEvent[]> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Filter overdue events from local storage
      const localEvents = await getGuestWaterEvents<LocalWaterEvent>();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const overdue = localEvents.filter(event => {
        if (event.status !== WaterEventStatus.PENDING) {
          return false;
        }
        const eventDate = new Date(event.scheduledDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
      });

      // Populate plant relationship for each event
      return this.populatePlantRelations(overdue);
    }

    // Get overdue events from API
    const response = await api.get<WaterEvent[]>('/water-events/overdue');
    return response.data;
  },

  /**
   * Get a single water event by ID
   */
  async getWaterEvent(id: string): Promise<WaterEvent> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Get event from local storage
      const localEvents = await getGuestWaterEvents<LocalWaterEvent>();
      const event = localEvents.find(e => e.id === id);

      if (!event) {
        throw new Error('Water event not found');
      }

      return event;
    }

    // Get event from API
    const response = await api.get<WaterEvent>(`/water-events/${id}`);
    return response.data;
  },

  /**
   * Complete a water event (mark as watered, postponed, or skipped)
   */
  async completeWaterEvent(id: string, data: CompleteWaterEventDto): Promise<WaterEvent> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Update event in local storage
      const localEvents = await getGuestWaterEvents<LocalWaterEvent>();
      const eventIndex = localEvents.findIndex(e => e.id === id);

      if (eventIndex === -1) {
        throw new Error('Water event not found');
      }

      const currentEvent = localEvents[eventIndex];
      const completedDate = data.completedDate || new Date().toISOString();

      // Mark current event as completed
      const updatedEvent: LocalWaterEvent = {
        ...currentEvent,
        status: data.action,
        completedDate,
        updatedAt: new Date().toISOString(),
      };

      localEvents[eventIndex] = updatedEvent;
      await setGuestWaterEvents(localEvents);

      // Create next water event based on action
      if (data.action === WaterEventStatus.WATERED || data.action === WaterEventStatus.POSTPONED) {
        // Get plant to access species water preference
        const { plantService } = await import('./plant.service');
        try {
          const plant = await plantService.getPlant(currentEvent.plantId);

          if (plant.species) {
            let daysToAdd: number;

            if (data.action === WaterEventStatus.WATERED) {
              // Use base watering interval
              daysToAdd = this.getWateringInterval(plant.species.waterPreference);
            } else {
              // Use postpone interval
              daysToAdd = this.getPostponeInterval(plant.species.waterPreference);
            }

            const nextDate = new Date(completedDate);
            nextDate.setDate(nextDate.getDate() + daysToAdd);
            const nextScheduledDate = nextDate.toISOString().split('T')[0];

            // Create new pending event
            await this.createWaterEvent(currentEvent.plantId, nextScheduledDate);
          }
        } catch (error) {
          console.error('Failed to create next water event:', error);
        }
      }

      return updatedEvent;
    }

    // Complete event via API
    const response = await api.patch<WaterEvent>(`/water-events/${id}/complete`, data);
    return response.data;
  },

  /**
   * Get watering interval based on water preference
   */
  getWateringInterval(waterPreference: 'LOW' | 'MEDIUM' | 'HIGH'): number {
    const intervals = {
      HIGH: 4,
      MEDIUM: 14,
      LOW: 30,
    };
    return intervals[waterPreference] || 14;
  },

  /**
   * Get postpone interval based on water preference
   */
  getPostponeInterval(waterPreference: 'LOW' | 'MEDIUM' | 'HIGH'): number {
    const intervals = {
      HIGH: 2,
      MEDIUM: 5,
      LOW: 10,
    };
    return intervals[waterPreference] || 5;
  },

  /**
   * Create a new water event (for guest mode)
   */
  async createWaterEvent(plantId: string, scheduledDate: string): Promise<WaterEvent> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Create event locally
      const localEvents = await getGuestWaterEvents<LocalWaterEvent>();
      console.log(`Current water events count: ${localEvents.length}`);

      const newEvent: LocalWaterEvent = {
        id: uuidv4(),
        plantId,
        scheduledDate,
        status: WaterEventStatus.PENDING,
        completedDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        localCreatedAt: new Date().toISOString(),
        syncedToBackend: false,
      };

      localEvents.push(newEvent);
      await setGuestWaterEvents(localEvents);
      console.log(`Water event stored. New count: ${localEvents.length}`, newEvent);

      return newEvent;
    }

    // Create event via API (not typically exposed in API, but included for completeness)
    const response = await api.post<WaterEvent>('/water-events', { plantId, scheduledDate });
    return response.data;
  },

  /**
   * Delete a water event (for guest mode)
   */
  async deleteWaterEvent(id: string): Promise<void> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Delete event from local storage
      const localEvents = await getGuestWaterEvents<LocalWaterEvent>();
      const filteredEvents = localEvents.filter(e => e.id !== id);
      await setGuestWaterEvents(filteredEvents);
      return;
    }

    // Delete event via API
    await api.delete(`/water-events/${id}`);
  },

  /**
   * Populate plant relationships for water events (guest mode helper)
   */
  async populatePlantRelations(events: WaterEvent[]): Promise<WaterEvent[]> {
    const { plantService } = await import('./plant.service');

    const eventsWithPlants = await Promise.all(
      events.map(async (event) => {
        try {
          const plant = await plantService.getPlant(event.plantId);
          return {
            ...event,
            plant,
          };
        } catch (error) {
          console.error(`Failed to load plant for event ${event.id}:`, error);
          return event; // Return event without plant if loading fails
        }
      })
    );

    return eventsWithPlants;
  },
};
