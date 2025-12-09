import api from './api';
import { PlantSpecies } from '../types/plant';

export const plantSpeciesService = {
  /**
   * Search plant species by common or latin name
   */
  async searchSpecies(query: string, limit: number = 10): Promise<PlantSpecies[]> {
    const response = await api.get<{ results: PlantSpecies[]; count: number; query: string }>('/plant-species/search', {
      params: { q: query, limit },
    });
    return response.data.results;
  },

  /**
   * Get all plant species
   */
  async getAllSpecies(): Promise<PlantSpecies[]> {
    const response = await api.get<PlantSpecies[]>('/plant-species');
    return response.data;
  },

  /**
   * Get a single plant species by ID
   */
  async getSpecies(id: string): Promise<PlantSpecies> {
    const response = await api.get<PlantSpecies>(`/plant-species/${id}`);
    return response.data;
  },
};
