import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetExemploQueryDto {
  @ApiProperty({ description: 'Nome para filtro (Prevenção de Injection via Tipagem)', required: false })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(100)
  nome?: string;
}
