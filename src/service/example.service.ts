import { Injectable } from '@nestjs/common';
import { ExemploRepository } from '../repository/example.repository';
import { Exemplo } from '../entity/exemplo.entity';

@Injectable()
export class ExemploService {
  constructor(private readonly exemploRepository: ExemploRepository) {}

  async listar(nome?: string): Promise<Exemplo[]> {
    if (nome) {
      return this.exemploRepository.buscarComFiltroSeguro(nome);
    }
    return this.exemploRepository.find();
  }
}
