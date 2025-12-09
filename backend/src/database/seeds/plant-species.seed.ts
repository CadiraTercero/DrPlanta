import { DataSource } from 'typeorm';
import { PlantSpecies } from '../../plant-species/entities/plant-species.entity';
import * as fs from 'fs';
import * as path from 'path';

export async function seedPlantSpecies(dataSource: DataSource): Promise<void> {
  const plantSpeciesRepository = dataSource.getRepository(PlantSpecies);

  // Check if data already exists
  const count = await plantSpeciesRepository.count();
  if (count > 0) {
    console.log('Plant species data already exists, skipping seed...');
    return;
  }

  // Load catalog data from JSON file
  const catalogPath = path.join(__dirname, '../../../../specs/data/plant-species-catalog.json');
  const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

  console.log(`Seeding ${catalogData.length} plant species...`);

  // Insert all plant species
  for (const speciesData of catalogData) {
    const species = plantSpeciesRepository.create(speciesData);
    await plantSpeciesRepository.save(species);
  }

  console.log('Plant species seeding completed successfully!');
}
