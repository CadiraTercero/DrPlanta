import api from './api';
import { Plant, CreatePlantDto, UpdatePlantDto } from '../types/plant';
import { isGuestMode, getGuestPlants, setGuestPlants } from '../utils/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

/**
 * Local Plant type for guest mode storage
 */
interface LocalPlant extends Omit<Plant, 'userId'> {
  localCreatedAt?: string;
  syncedToBackend?: boolean;
}

export const plantService = {
  /**
   * Get all plants for the current user (authenticated or guest)
   */
  async getPlants(): Promise<Plant[]> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Get plants from local storage
      const localPlants = await getGuestPlants<LocalPlant>();
      // Convert local plants to Plant format (add dummy userId for compatibility)
      return localPlants.map(plant => ({
        ...plant,
        userId: 'guest',
      }));
    }

    // Get plants from API
    const response = await api.get<Plant[]>('/plants');
    return response.data;
  },

  /**
   * Get a single plant by ID
   */
  async getPlant(id: string): Promise<Plant> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Get plant from local storage
      const localPlants = await getGuestPlants<LocalPlant>();
      const plant = localPlants.find(p => p.id === id);

      if (!plant) {
        throw new Error('Plant not found');
      }

      return {
        ...plant,
        userId: 'guest',
      };
    }

    // Get plant from API
    const response = await api.get<Plant>(`/plants/${id}`);
    return response.data;
  },

  /**
   * Create a new plant
   */
  async createPlant(data: CreatePlantDto): Promise<Plant> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Create plant locally
      const localPlants = await getGuestPlants<LocalPlant>();

      // Get species data if speciesId is provided
      let speciesData = undefined;
      if (data.speciesId) {
        try {
          const { plantSpeciesService } = await import('./plant-species.service');
          speciesData = await plantSpeciesService.getSpecies(data.speciesId);
        } catch (error) {
          console.error('Failed to load species data:', error);
        }
      }

      const newPlant: LocalPlant = {
        id: uuidv4(),
        name: data.name,
        location: data.location,
        acquisitionDate: data.acquisitionDate,
        notes: data.notes,
        photos: data.photos || [],
        species: speciesData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        localCreatedAt: new Date().toISOString(),
        syncedToBackend: false,
      };

      // Add to local storage
      localPlants.push(newPlant);
      await setGuestPlants(localPlants);

      // Create initial water event if species has watering info
      if (speciesData) {
        try {
          const { waterEventService } = await import('./water-event.service');
          const daysUntilWater = this.calculateDaysUntilWater(speciesData.waterPreference);
          const scheduledDate = new Date();
          scheduledDate.setDate(scheduledDate.getDate() + daysUntilWater);
          const scheduledDateStr = scheduledDate.toISOString().split('T')[0];

          console.log(`Creating water event for plant ${newPlant.name}:`, {
            plantId: newPlant.id,
            scheduledDate: scheduledDateStr,
            daysUntilWater,
            waterPreference: speciesData.waterPreference,
          });

          await waterEventService.createWaterEvent(newPlant.id, scheduledDateStr);
          console.log(`Water event created successfully for ${newPlant.name}`);
        } catch (error) {
          console.error('Failed to create initial water event:', error);
        }
      } else {
        console.log(`No species data for plant ${newPlant.name}, skipping water event creation`);
      }

      return {
        ...newPlant,
        userId: 'guest',
      };
    }

    // Create plant via API
    const response = await api.post<Plant>('/plants', data);
    return response.data;
  },

  /**
   * Update an existing plant
   */
  async updatePlant(id: string, data: UpdatePlantDto): Promise<Plant> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Update plant in local storage
      const localPlants = await getGuestPlants<LocalPlant>();
      const plantIndex = localPlants.findIndex(p => p.id === id);

      if (plantIndex === -1) {
        throw new Error('Plant not found');
      }

      const updatedPlant: LocalPlant = {
        ...localPlants[plantIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      localPlants[plantIndex] = updatedPlant;
      await setGuestPlants(localPlants);

      return {
        ...updatedPlant,
        userId: 'guest',
      };
    }

    // Update plant via API
    const response = await api.patch<Plant>(`/plants/${id}`, data);
    return response.data;
  },

  /**
   * Delete a plant
   */
  async deletePlant(id: string): Promise<void> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Delete plant from local storage
      const localPlants = await getGuestPlants<LocalPlant>();
      const filteredPlants = localPlants.filter(p => p.id !== id);
      await setGuestPlants(filteredPlants);
      return;
    }

    // Delete plant via API
    await api.delete(`/plants/${id}`);
  },

  /**
   * Search plants by name or location
   */
  async searchPlants(searchTerm: string): Promise<Plant[]> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Search in local storage
      const localPlants = await getGuestPlants<LocalPlant>();
      const searchLower = searchTerm.toLowerCase();

      const filtered = localPlants.filter(plant =>
        plant.name.toLowerCase().includes(searchLower) ||
        (plant.location && plant.location.toLowerCase().includes(searchLower))
      );

      return filtered.map(plant => ({
        ...plant,
        userId: 'guest',
      }));
    }

    // Search via API
    const response = await api.get<Plant[]>('/plants', {
      params: { search: searchTerm },
    });
    return response.data;
  },

  /**
   * Calculate days until next watering based on water preference
   */
  calculateDaysUntilWater(waterPreference: 'LOW' | 'MEDIUM' | 'HIGH'): number {
    switch (waterPreference) {
      case 'HIGH':
        return 4; // Water every 4 days
      case 'MEDIUM':
        return 14; // Water every 14 days
      case 'LOW':
        return 30; // Water every 30 days
      default:
        return 14; // Default to MEDIUM (14 days)
    }
  },
};
