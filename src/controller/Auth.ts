import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../service/Auth';
import { LoginDto } from '../dto/Auth';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gerar token de acesso (JWT) para testes' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
