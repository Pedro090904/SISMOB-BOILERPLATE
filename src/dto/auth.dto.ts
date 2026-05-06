import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Usuário do sistema' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'sismob@2026', description: 'Senha do sistema' })
  @IsString()
  password: string;
}