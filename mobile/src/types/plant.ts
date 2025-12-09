export interface PlantSpecies {
  id: string;
  commonName: string;
  latinName: string;
  lightPreference: 'LOW' | 'MEDIUM' | 'HIGH';
  waterPreference: 'LOW' | 'MEDIUM' | 'HIGH';
  humidityPreference: 'LOW' | 'MEDIUM' | 'HIGH';
  toxicity: 'NON_TOXIC' | 'TOXIC_PETS' | 'TOXIC_HUMANS' | 'TOXIC_PETS_AND_HUMANS';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  recommendedIndoor: boolean;
  tags: string[];
  shortDescription: string;
  notes?: string;
}

export interface Plant {
  id: string;
  name: string;
  location?: string;
  acquisitionDate?: string;
  notes?: string;
  photos?: string[];
  species?: PlantSpecies;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlantDto {
  name: string;
  location?: string;
  acquisitionDate?: string;
  notes?: string;
  photos?: string[];
  speciesId?: string;
}

export interface UpdatePlantDto {
  name?: string;
  location?: string;
  acquisitionDate?: string;
  notes?: string;
  photos?: string[];
  speciesId?: string;
}
