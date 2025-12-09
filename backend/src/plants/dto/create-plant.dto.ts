import { IsString, IsOptional, IsDateString, IsArray, IsUUID, MaxLength } from 'class-validator';

export class CreatePlantDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsDateString()
  acquisitionDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @IsOptional()
  @IsUUID()
  speciesId?: string;
}
