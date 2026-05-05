import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Linha } from '../entity/linha.entity';

@Injectable()
export class LinhaRepository extends Repository<Linha> {
  constructor(private dataSource: DataSource) {
    super(Linha, dataSource.createEntityManager());
  }

  async findByFilters(codigo?: string, descricao?: string): Promise<Linha[]> {
    const query = this.createQueryBuilder('l');

    if (codigo) {
      // PROTEÇÃO: O uso de :codigo vincula o valor com segurança
      query.andWhere('l.codigo = :codigo', { codigo });
    }

    if (descricao) {
      // PROTEÇÃO: Like parametrizado
      query.andWhere('l.descricao LIKE :descricao', { descricao: `%${descricao}%` });
    }

    return query.getMany();
  }
}
