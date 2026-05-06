import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'SISMOB_SECRET_KEY_2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '8h', // Expiração padrão de 8 horas
}));
