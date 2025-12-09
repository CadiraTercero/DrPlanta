import { Exclude, Expose, Type } from 'class-transformer';

class PlantSpeciesDto {
  @Expose()
  id: string;

  @Expose()
  commonName: string;

  @Expose()
  latinName: string;

  @Expose()
  lightPreference: string;

  @Expose()
  waterPreference: string;

  @Expose()
  humidityPreference: string;

  @Expose()
  toxicity: string;

  @Expose()
  difficulty: string;

  @Expose()
  recommendedIndoor: boolean;

  @Expose()
  tags: string[];

  @Expose()
  shortDescription: string;

  @Expose()
  notes: string;
}

@Exclude()
export class PlantResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  location: string;

  @Expose()
  acquisitionDate: Date;

  @Expose()
  notes: string;

  @Expose()
  photos: string[];

  @Expose()
  @Type(() => PlantSpeciesDto)
  species: PlantSpeciesDto;

  @Expose()
  userId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
