import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterLinhaDto {
  @ApiProperty({ description: 'Código da linha (Ex: 0.108)', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(8)
  codigo?: string;

  @ApiProperty({ description: 'Descrição da linha (Ex: W3 Norte)', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricao?: string;
}
