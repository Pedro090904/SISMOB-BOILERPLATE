import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Linha } from '../entity/Linha';
import { LinhaRepository } from '../repository/linha.repository';
import { LinhaService } from '../service/linha.service';
import { LinhaController } from '../controller/linha.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Linha])],
  controllers: [LinhaController],
  providers: [LinhaService, LinhaRepository],
})
export class LinhaModule { }
