import api from './api';
import { Plant, CreatePlantDto, UpdatePlantDto } from '../types/plant';

export const plantService = {
  /**
   * Get all plants for the authenticated user
   */
  async getPlants(): Promise<Plant[]> {
    const response = await api.get<Plant[]>('/plants');
    return response.data;
  },

  /**
   * Get a single plant by ID
   */
  async getPlant(id: string): Promise<Plant> {
    const response = await api.get<Plant>(`/plants/${id}`);
    return response.data;
  },

  /**
   * Create a new plant
   */
  async createPlant(data: CreatePlantDto): Promise<Plant> {
    const response = await api.post<Plant>('/plants', data);
    return response.data;
  },

  /**
   * Update an existing plant
   */
  async updatePlant(id: string, data: UpdatePlantDto): Promise<Plant> {
    const response = await api.patch<Plant>(`/plants/${id}`, data);
    return response.data;
  },

  /**
   * Delete a plant
   */
  async deletePlant(id: string): Promise<void> {
    await api.delete(`/plants/${id}`);
  },

  /**
   * Search plants by name or location
   */
  async searchPlants(searchTerm: string): Promise<Plant[]> {
    const response = await api.get<Plant[]>('/plants', {
      params: { search: searchTerm },
    });
    return response.data;
  },
};
