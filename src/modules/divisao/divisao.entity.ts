import { randomUUID } from 'crypto';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Propriedade } from '../propriedade/propriedade.entity';

export enum DivisaoTipo {
  Pasto = 'pasto',
  Reserva = 'reserva',
  Instalacao = 'instalacao',
}

@Entity('divisao')
export class Divisao extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_divisao' })
  id: string = randomUUID();

  @ManyToOne(() => Propriedade)
  @JoinColumn({ name: 'fk_id_propriedade' })
  propriedade: Propriedade;

  @Column({ type: 'varchar', length: 50 })
  nome: string;

  @Column({ type: 'enum', enum: DivisaoTipo, default: DivisaoTipo.Pasto })
  tipo: DivisaoTipo;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: null, name: 'area_hectares' })
  areaHectares: number | null;

  @Column({ type: 'boolean', default: true })
  ativa: boolean;
}
