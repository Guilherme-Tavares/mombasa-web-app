import { randomUUID } from 'crypto';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

export enum TemporadaTipo {
  Aguas = 'aguas',
  Seca = 'seca',
  Transicao = 'transicao',
}

@Entity('temporada')
export class Temporada extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_temporada' })
  id: string = randomUUID();

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'enum', enum: TemporadaTipo })
  tipo: TemporadaTipo;

  @Column({ type: 'date', name: 'data_inicio' })
  dataInicio: string;

  @Column({ type: 'date', name: 'data_fim' })
  dataFim: string;
}
