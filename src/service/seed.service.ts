import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'fs';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    await this.seedTabLinha();
  }

  private async seedTabLinha() {
    try {
      // Verificar se a tabela já tem dados para não duplicar
      const countResult = await this.dataSource.query('SELECT COUNT(*) as total FROM dados_mobilidade.tab_linha');
      const total = parseInt(countResult[0].total, 10);

      if (total > 0) {
        this.logger.log('Tabela tab_linha já contém dados. Pulando seed.');
        return;
      }

      this.logger.log('Iniciando seed da tabela tab_linha...');

      // Caminho do arquivo SQL
      const sqlPath = 'd:/SISMOB/SISMOB-BOILERPLATE/src/config/tab_linha.sql';
      
      if (!require('fs').existsSync(sqlPath)) {
        this.logger.error(`Arquivo SQL não encontrado em: ${sqlPath}`);
        return;
      }

      const sqlContent = require('fs').readFileSync(sqlPath, 'utf8');
      
      // O arquivo pode conter múltiplos comandos. No Postgres, podemos executar o bloco todo.
      await this.dataSource.query(sqlContent);

      this.logger.log('Seed da tabela tab_linha concluído com sucesso!');
    } catch (error) {
      this.logger.error(`Erro ao realizar seed da tabela tab_linha: ${error.message}`);
    }
  }
}
