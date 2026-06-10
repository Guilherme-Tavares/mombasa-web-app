import { randomUUID } from 'crypto';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Medicamento } from '../medicamento/medicamento.entity';
import { Propriedade } from '../propriedade/propriedade.entity';

export enum EstoqueUnidade {
  Ml = 'ml',
  L = 'l',
  G = 'g',
  Kg = 'kg',
  Doses = 'doses',
  Frascos = 'frascos',
}

@Entity('estoque_medicamento')
export class EstoqueMedicamento extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_estoque_med' })
  id: string = randomUUID();

  @ManyToOne(() => Propriedade)
  @JoinColumn({ name: 'fk_id_propriedade' })
  propriedade: Propriedade;

  @ManyToOne(() => Medicamento)
  @JoinColumn({ name: 'fk_id_medicamento' })
  medicamento: Medicamento;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantidade: number;

  @Column({ type: 'enum', enum: EstoqueUnidade })
  unidade: EstoqueUnidade;

  @Column({ type: 'date', name: 'data_entrada' })
  dataEntrada: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'estoque_minimo' })
  estoqueMinimo: number;
}
