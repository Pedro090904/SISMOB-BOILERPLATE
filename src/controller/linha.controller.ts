import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LinhaService } from '../service/linha.service';
import { FilterLinhaDto } from '../dto/linha.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Linhas de Mobilidade')
@Controller('linhas')
export class LinhaController {
  constructor(private readonly linhaService: LinhaService) {}

  @Get()
  @UseGuards(JwtAuthGuard) // Proteção por TOKEN e EXPIRAÇÃO
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter linhas com proteção anti-injection e autenticação' })
  async getLinhas(@Query() filters: FilterLinhaDto) {
    return this.linhaService.buscarLinhas(filters.codigo, filters.descricao);
  }
}
