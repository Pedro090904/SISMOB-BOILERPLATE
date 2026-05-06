import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_SERVICE_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    logging: Boolean(process.env.DB_LOGGING),
    autoLoadEntities: true,
  }),
);
