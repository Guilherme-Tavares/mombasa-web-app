import { randomUUID } from 'crypto';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Bovino } from '../bovino/bovino.entity';
import { Medicamento } from '../medicamento/medicamento.entity';

export enum UnidadeDose {
  Ml = 'ml',
  G = 'g',
  Doses = 'doses',
}

@Entity('aplicacao_medicamento')
export class AplicacaoMedicamento extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_aplicacao' })
  id: string = randomUUID();

  @ManyToOne(() => Bovino)
  @JoinColumn({ name: 'fk_id_bovino' })
  bovino: Bovino;

  @ManyToOne(() => Medicamento)
  @JoinColumn({ name: 'fk_id_medicamento' })
  medicamento: Medicamento;

  @Column({ type: 'datetime', name: 'data_aplicacao' })
  dataAplicacao: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  dose: number;

  @Column({ type: 'enum', enum: UnidadeDose, name: 'unidade_dose' })
  unidadeDose: UnidadeDose;
}
