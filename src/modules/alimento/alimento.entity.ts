import { randomUUID } from 'crypto';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

export enum AlimentoTipo {
  Racao = 'racao',
  SalMineral = 'sal_mineral',
  Silagem = 'silagem',
  Farelo = 'farelo',
  Suplemento = 'suplemento',
  Outro = 'outro',
}

@Entity('alimento')
export class Alimento extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_alimento' })
  id: string = randomUUID();

  @Column({ type: 'varchar', length: 100, unique: true })
  nome: string;

  @Column({ type: 'enum', enum: AlimentoTipo })
  tipo: AlimentoTipo;
}
