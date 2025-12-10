import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { PlantSpeciesService } from './plant-species.service';
import { PlantSpecies } from './entities/plant-species.entity';

@Controller('plant-species')
export class PlantSpeciesController {
  constructor(private readonly plantSpeciesService: PlantSpeciesService) {}

  @Get('search')
  async search(
    @Query('q') q?: string,
    @Query('query') query?: string,
    @Query('limit') limit?: string,
  ): Promise<{ results: PlantSpecies[]; count: number; query: string }> {
    // Accept either 'q' or 'query' parameter
    const searchTerm = q || query;

    // Validation
    if (!searchTerm) {
      throw new BadRequestException(
        "Query parameter 'q' or 'query' is required",
      );
    }

    if (searchTerm.length < 2) {
      throw new BadRequestException(
        'Query must be at least 2 characters long',
      );
    }

    // Parse limit with default and max
    const parsedLimit = limit ? Math.min(parseInt(limit, 10), 50) : 10;

    // Search
    const results = await this.plantSpeciesService.search(
      searchTerm,
      parsedLimit,
    );

    return {
      results,
      count: results.length,
      query: searchTerm,
    };
  }

  @Get()
  async findAll(): Promise<PlantSpecies[]> {
    return this.plantSpeciesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PlantSpecies> {
    const species = await this.plantSpeciesService.findOne(id);
    if (!species) {
      throw new BadRequestException(`Plant species with ID ${id} not found`);
    }
    return species;
  }
}
