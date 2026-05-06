import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Linha } from '../entity/Linha';
import { LinhaRepository } from '../repository/Linha';
import { LinhaService } from '../service/Linha';
import { LinhaController } from '../controller/Linha';

@Module({
  imports: [TypeOrmModule.forFeature([Linha])],
  controllers: [LinhaController],
  providers: [LinhaService, LinhaRepository],
})
export class LinhaModule { }
