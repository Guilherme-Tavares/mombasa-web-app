import { randomUUID } from 'crypto';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Divisao } from '../divisao/divisao.entity';

@Entity('forragem')
export class Forragem extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_forragem' })
  id: string = randomUUID();

  @ManyToOne(() => Divisao)
  @JoinColumn({ name: 'fk_id_divisao' })
  divisao: Divisao;

  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @Column({ type: 'date', nullable: true, default: null, name: 'data_plantio' })
  dataPlantio: string | null;

  @Column({ type: 'boolean', default: true })
  ativa: boolean;
}
