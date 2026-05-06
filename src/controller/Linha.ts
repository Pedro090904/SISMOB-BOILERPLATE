import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LinhaService } from '../service/Linha';
import { FilterLinhaDto } from '../dto/Linha';
import { JwtAuthGuard } from '../guards/Jwt';

@ApiTags('Linhas de Mobilidade')
@ApiBearerAuth() // Ativa o cadeado para todas as rotas deste controller no Swagger
@Controller('linhas')
export class LinhaController {
  constructor(private readonly linhaService: LinhaService) { }

  @Get()
  @UseGuards(JwtAuthGuard) // Proteção por TOKEN e EXPIRAÇÃO
  @ApiOperation({ summary: 'Obter linhas com proteção anti-injection e autenticação' })
  async getLinhas(@Query() filters: FilterLinhaDto) {
    return this.linhaService.buscarLinhas(filters.codigo, filters.descricao);
  }
}
