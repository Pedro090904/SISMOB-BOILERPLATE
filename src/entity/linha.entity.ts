import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'tab_linha', schema: 'dados_mobilidade' })
export class Linha {
  @PrimaryColumn({ name: 'id_linha' })
  id: number;

  @Column({ name: 'cd_linha', length: 8 })
  codigo: string;

  @Column({ name: 'tx_linha', length: 255 })
  descricao: string;

  @Column({ name: 'vl_tarifa', type: 'numeric', precision: 6, scale: 2 })
  valorTarifa: number;

  @Column({ name: 'fx_tarifaria', length: 50, nullable: true })
  faixaTarifaria: string;

  @CreateDateColumn({ name: 'dataregistro' })
  dataRegistro: Date;

  @Column({ name: 'dt_inicial_tarifa', type: 'date', nullable: true })
  dataInicialTarifa: Date;

  @Column({ name: 'dt_final_tarifa', type: 'date', nullable: true })
  dataFinalTarifa: Date;
}
