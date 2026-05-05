import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'oracle',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '1521', 10),
    serviceName: process.env.DB_SERVICE_NAME || 'XE',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: [__dirname + '/../entity/*.entity{.ts,.js}'],
    // ⚠️  synchronize: true é PERIGOSO com Oracle:
    //     tenta fazer DROP em colunas internas (SYS_NC$) e quebra.
    //     Use scripts SQL manuais (scripts/add_columns.sql) para evoluir o schema.
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
  }),
);
