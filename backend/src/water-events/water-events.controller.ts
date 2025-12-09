import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { WaterEventsService } from './water-events.service';
import { CompleteWaterEventDto } from './dto/complete-water-event.dto';
import { CreateWaterEventDto } from './dto/create-water-event.dto';
import { QueryWaterEventsDto } from './dto/query-water-events.dto';
import { WaterEventResponseDto } from './dto/water-event-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';

@Controller('water-events')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class WaterEventsController {
  constructor(private readonly waterEventsService: WaterEventsService) {}

  @Post()
  async create(
    @Request() req: any,
    @Body() createWaterEventDto: CreateWaterEventDto,
  ) {
    const waterEvent = await this.waterEventsService.create(
      req.user.id,
      createWaterEventDto,
    );
    return plainToInstance(WaterEventResponseDto, waterEvent, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async getEventsForDateRange(
    @Request() req: any,
    @Query() query: QueryWaterEventsDto,
  ) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    const events = await this.waterEventsService.getEventsForDateRange(
      req.user.id,
      startDate,
      endDate,
    );

    return plainToInstance(WaterEventResponseDto, events, {
      excludeExtraneousValues: true,
    });
  }

  @Get('overdue')
  async getOverdueEvents(@Request() req: any) {
    const events = await this.waterEventsService.getOverdueEvents(req.user.id);
    return plainToInstance(WaterEventResponseDto, events, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const waterEvent = await this.waterEventsService.findOne(id, req.user.id);
    return plainToInstance(WaterEventResponseDto, waterEvent, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id/complete')
  async completeWaterEvent(
    @Param('id') id: string,
    @Request() req: any,
    @Body() completeWaterEventDto: CompleteWaterEventDto,
  ) {
    const waterEvent = await this.waterEventsService.completeWaterEvent(
      id,
      req.user.id,
      completeWaterEventDto,
    );
    return plainToInstance(WaterEventResponseDto, waterEvent, {
      excludeExtraneousValues: true,
    });
  }
}
