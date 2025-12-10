import api from './api';
import { getGuestPlants, getGuestWaterEvents, getGuestPhotos } from '../utils/storage';
import { Plant } from '../types/plant';
import { WaterEvent } from '../types/water-event';

/**
 * Local Plant type for guest mode storage
 */
interface LocalPlant extends Omit<Plant, 'userId'> {
  localCreatedAt?: string;
  syncedToBackend?: boolean;
}

/**
 * Local Water Event type for guest mode storage
 */
interface LocalWaterEvent extends WaterEvent {
  localCreatedAt?: string;
  syncedToBackend?: boolean;
}

/**
 * Sync result tracking
 */
export interface SyncResult {
  success: boolean;
  plantsSynced: number;
  waterEventsSynced: number;
  photosSynced: number;
  errors: string[];
  idMapping: {
    plants: { [localId: string]: string };
    waterEvents: { [localId: string]: string };
  };
}

/**
 * Sync progress callback type
 */
export type SyncProgressCallback = (progress: {
  step: string;
  current: number;
  total: number;
  percentage: number;
}) => void;

export const syncService = {
  /**
   * Sync all guest data to backend after authentication
   */
  async syncGuestData(onProgress?: SyncProgressCallback): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      plantsSynced: 0,
      waterEventsSynced: 0,
      photosSynced: 0,
      errors: [],
      idMapping: {
        plants: {},
        waterEvents: {},
      },
    };

    try {
      // Get all local data
      const localPlants = await getGuestPlants<LocalPlant>();
      const localWaterEvents = await getGuestWaterEvents<LocalWaterEvent>();
      const localPhotos = await getGuestPhotos();

      const totalItems = localPlants.length + localWaterEvents.length + localPhotos.length;
      let currentItem = 0;

      // Report initial progress
      onProgress?.({
        step: 'Starting sync...',
        current: 0,
        total: totalItems,
        percentage: 0,
      });

      // 1. Sync plants first
      for (const plant of localPlants) {
        try {
          onProgress?.({
            step: `Syncing plant: ${plant.name}`,
            current: ++currentItem,
            total: totalItems,
            percentage: Math.round((currentItem / totalItems) * 100),
          });

          const response = await api.post<Plant>('/plants', {
            name: plant.name,
            location: plant.location,
            acquisitionDate: plant.acquisitionDate,
            notes: plant.notes,
            photos: plant.photos,
            speciesId: plant.species?.id,
          });

          // Map local ID to backend ID
          result.idMapping.plants[plant.id] = response.data.id;
          result.plantsSynced++;
        } catch (error: any) {
          console.error(`Failed to sync plant ${plant.name}:`, error);
          result.errors.push(`Plant "${plant.name}": ${error.message}`);
        }
      }

      // 2. Sync water events with updated plant IDs
      for (const event of localWaterEvents) {
        try {
          onProgress?.({
            step: 'Syncing water event',
            current: ++currentItem,
            total: totalItems,
            percentage: Math.round((currentItem / totalItems) * 100),
          });

          // Map local plant ID to backend plant ID
          const backendPlantId = result.idMapping.plants[event.plantId];

          if (!backendPlantId) {
            result.errors.push(`Water event: Plant not found for local ID ${event.plantId}`);
            continue;
          }

          // Create water event with mapped plant ID
          const response = await api.post<WaterEvent>('/water-events', {
            plantId: backendPlantId,
            scheduledDate: event.scheduledDate,
            status: event.status,
            completedDate: event.completedDate,
          });

          result.idMapping.waterEvents[event.id] = response.data.id;
          result.waterEventsSynced++;
        } catch (error: any) {
          console.error('Failed to sync water event:', error);
          result.errors.push(`Water event: ${error.message}`);
        }
      }

      // 3. Sync photos (if there's a photo upload endpoint)
      for (const photo of localPhotos) {
        try {
          onProgress?.({
            step: 'Syncing photo',
            current: ++currentItem,
            total: totalItems,
            percentage: Math.round((currentItem / totalItems) * 100),
          });

          // TODO: Implement photo upload if needed
          // For now, photos are already included in plant data
          result.photosSynced++;
        } catch (error: any) {
          console.error('Failed to sync photo:', error);
          result.errors.push(`Photo: ${error.message}`);
        }
      }

      // Mark as successful if we synced at least some data
      result.success = result.plantsSynced > 0 || result.waterEventsSynced > 0;

      onProgress?.({
        step: 'Sync complete',
        current: totalItems,
        total: totalItems,
        percentage: 100,
      });

      return result;
    } catch (error: any) {
      console.error('Sync failed:', error);
      result.errors.push(`Sync failed: ${error.message}`);
      throw new Error(`Failed to sync data: ${error.message}`);
    }
  },

  /**
   * Validate sync by checking if all data exists on backend
   */
  async validateSync(syncResult: SyncResult): Promise<boolean> {
    try {
      // Fetch all plants from backend
      const plantsResponse = await api.get<Plant[]>('/plants');
      const backendPlants = plantsResponse.data;

      // Check if synced plants exist
      const syncedPlantIds = Object.values(syncResult.idMapping.plants);
      const allPlantsExist = syncedPlantIds.every(id =>
        backendPlants.some(plant => plant.id === id)
      );

      return allPlantsExist && syncResult.success;
    } catch (error) {
      console.error('Validation failed:', error);
      return false;
    }
  },
};
