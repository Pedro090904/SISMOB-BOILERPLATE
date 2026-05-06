import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    // Simulação de validação (Em um sistema real, aqui consultaria o banco ou AD)
    if (loginDto.username === 'admin' && loginDto.password === 'sismob@2026') {
      const payload = { 
        username: loginDto.username, 
        sub: 1, 
        role: 'ADMIN' 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        token_type: 'Bearer',
        expires_in: '8h'
      };
    }

    throw new UnauthorizedException('Usuário ou senha inválidos');
  }
}
