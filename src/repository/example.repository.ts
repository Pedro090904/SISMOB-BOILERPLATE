import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Exemplo } from '../entity/exemplo.entity';

@Injectable()
export class ExemploRepository extends Repository<Exemplo> {
  constructor(private dataSource: DataSource) {
    super(Exemplo, dataSource.createEntityManager());
  }

  async buscarComFiltroSeguro(nome: string): Promise<Exemplo[]> {
    // PROTEÇÃO CONTRA INJECTION: 
    // O TypeORM parametriza automaticamente os valores passados no objeto 'where'
    return this.find({
      where: {
        nome: nome, // O valor é escapado automaticamente
      },
    });
  }

  async buscarViaQueryBuilder(nome: string): Promise<Exemplo[]> {
    // Exemplo usando QueryBuilder (também seguro contra Injection)
    return this.createQueryBuilder('exemplo')
      .where('exemplo.DSC_NOME = :nome', { nome }) // Parâmetro ':nome' é seguro
      .getMany();
  }
}
