import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { PlantResponseDto } from './dto/plant-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';

@Controller('plants')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  async create(@Request() req: any, @Body() createPlantDto: CreatePlantDto) {
    const plant = await this.plantsService.create(req.user.id, createPlantDto);
    return plainToInstance(PlantResponseDto, plant, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll(@Request() req: any, @Query('search') search?: string) {
    const plants = search
      ? await this.plantsService.search(req.user.id, search)
      : await this.plantsService.findAll(req.user.id);

    return plainToInstance(PlantResponseDto, plants, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const plant = await this.plantsService.findOne(id, req.user.id);
    return plainToInstance(PlantResponseDto, plant, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePlantDto: UpdatePlantDto,
  ) {
    const plant = await this.plantsService.update(
      id,
      req.user.id,
      updatePlantDto,
    );
    return plainToInstance(PlantResponseDto, plant, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.plantsService.remove(id, req.user.id);
    return { message: 'Plant deleted successfully' };
  }
}
