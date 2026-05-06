import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Linha } from '../entity/Linha';

@Injectable()
export class LinhaRepository extends Repository<Linha> {
  constructor(private dataSource: DataSource) {
    super(Linha, dataSource.createEntityManager());
  }

  async findByFilters(codigo?: string, descricao?: string): Promise<Linha[]> {
    let sql = `
      SELECT 
        id_linha as "id", 
        cd_linha as "codigo", 
        tx_linha as "descricao", 
        vl_tarifa as "valorTarifa", 
        fx_tarifaria as "faixaTarifaria", 
        dataregistro as "dataRegistro", 
        dt_inicial_tarifa as "dataInicialTarifa", 
        dt_final_tarifa as "dataFinalTarifa"
      FROM dados_mobilidade.tab_linha 
      WHERE 1=1
    `;

    const params: any[] = [];

    if (codigo) {
      // PROTEÇÃO: O uso de :n (ou ?) garante que o valor seja tratado como dado, não código
      sql += ` AND cd_linha = :${params.length + 1}`;
      params.push(codigo);
    }

    if (descricao) {
      sql += ` AND tx_linha LIKE :${params.length + 1}`;
      params.push(`%${descricao}%`);
    }

    // Executa a query nativa de forma segura
    return this.dataSource.query(sql, params);
  }
}
