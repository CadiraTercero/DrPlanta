import api from './api';
import { PlantSpecies } from '../types/plant';
import { isGuestMode } from '../utils/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// Import bundled species catalog
const speciesCatalog = require('../../assets/data/plant-species-catalog.json');

/**
 * Local species cache with generated IDs
 */
let localSpeciesCache: PlantSpecies[] | null = null;

/**
 * Load and cache species from bundled catalog
 */
function loadLocalSpecies(): PlantSpecies[] {
  if (localSpeciesCache) {
    return localSpeciesCache;
  }

  // Add IDs to species that don't have them
  localSpeciesCache = speciesCatalog.map((species: any) => ({
    ...species,
    id: species.id || uuidv4(),
  }));

  return localSpeciesCache;
}

export const plantSpeciesService = {
  /**
   * Search plant species by common or latin name
   */
  async searchSpecies(query: string, limit: number = 10): Promise<PlantSpecies[]> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Search in local catalog
      const allSpecies = loadLocalSpecies();
      const searchLower = query.toLowerCase();

      const filtered = allSpecies.filter(species =>
        species.commonName.toLowerCase().includes(searchLower) ||
        species.latinName.toLowerCase().includes(searchLower) ||
        species.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );

      return filtered.slice(0, limit);
    }

    // Search via API
    const response = await api.get<{ results: PlantSpecies[]; count: number; query: string }>('/plant-species/search', {
      params: { q: query, limit },
    });
    return response.data.results;
  },

  /**
   * Get all plant species
   */
  async getAllSpecies(): Promise<PlantSpecies[]> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Return all species from local catalog
      return loadLocalSpecies();
    }

    // Get all species from API
    const response = await api.get<PlantSpecies[]>('/plant-species');
    return response.data;
  },

  /**
   * Get a single plant species by ID
   */
  async getSpecies(id: string): Promise<PlantSpecies> {
    const guestMode = await isGuestMode();

    if (guestMode) {
      // Find species in local catalog
      const allSpecies = loadLocalSpecies();
      const species = allSpecies.find(s => s.id === id);

      if (!species) {
        throw new Error('Species not found');
      }

      return species;
    }

    // Get species from API
    const response = await api.get<PlantSpecies>(`/plant-species/${id}`);
    return response.data;
  },
};
