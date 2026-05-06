import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/Database';
import jwtConfig from './config/Jwt';
import { AuthController } from './controller/Auth';
import { LinhaModule } from './module/Linha';
import { SeedService } from './service/Seed';
import { AuthService } from './service/Auth';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        jwtConfig
      ],
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('database') as any,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('jwt') as any,
      global: true,
    }),
    LinhaModule,
  ],
  controllers: [AuthController],
  providers: [SeedService, AuthService],
})
export class AppModule { }
