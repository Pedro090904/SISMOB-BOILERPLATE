import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exemplo } from '../entity/exemplo.entity';
import { ExemploRepository } from '../repository/example.repository';
import { ExemploService } from '../service/example.service';
import { ExemploController } from '../controller/example.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exemplo]),
    JwtModule.register({}), // Necessário para injetar o JwtService no Guard
  ],
  controllers: [ExemploController],
  providers: [ExemploService, ExemploRepository],
})
export class ExemploModule {}
