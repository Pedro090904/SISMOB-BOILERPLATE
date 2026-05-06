import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { AuthController } from './controller/auth.controller';
import { LinhaModule } from './module/linha.module';
import { SeedService } from './service/seed.service';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig, jwtConfig] }),
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
export class AppModule {}
