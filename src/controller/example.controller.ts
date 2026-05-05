import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExemploService } from '../service/example.service';
import { GetExemploQueryDto } from '../dto/example.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Exemplo')
@Controller('exemplo')
export class ExemploController {
  constructor(private readonly exemploService: ExemploService) {}

  @Get()
  @UseGuards(JwtAuthGuard) // PROTEÇÃO: Apenas tokens válidos e não expirados acessam
  @ApiBearerAuth() // Indica no Swagger que precisa de Token
  @ApiOperation({ summary: 'Listagem protegida com filtros anti-injection' })
  async findAll(@Query() query: GetExemploQueryDto) {
    return this.exemploService.listar(query.nome);
  }
}
