import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../utils/base.entity';

@Entity('TAB_EXEMPLO')
export class Exemplo extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ID_EXEMPLO' })
  id: number;

  @Column({ name: 'DSC_NOME', length: 100 })
  nome: string;
}
