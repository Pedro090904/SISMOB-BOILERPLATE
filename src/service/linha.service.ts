import { Injectable } from '@nestjs/common';
import { LinhaRepository } from '../repository/linha.repository';
import { Linha } from '../entity/Linha';

@Injectable()
export class LinhaService {
  constructor(private readonly linhaRepository: LinhaRepository) { }

  async buscarLinhas(codigo?: string, descricao?: string): Promise<Linha[]> {
    return this.linhaRepository.findByFilters(codigo, descricao);
  }
}
