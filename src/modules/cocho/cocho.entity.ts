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

export enum CochoTipoMaterial {
  Madeira = 'madeira',
  Concreto = 'concreto',
  Plastico = 'plastico',
  Metal = 'metal',
}

@Entity('cocho')
export class Cocho extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_cocho' })
  id: string = randomUUID();

  @ManyToOne(() => Divisao)
  @JoinColumn({ name: 'fk_id_divisao' })
  divisao: Divisao;

  @Column({ type: 'varchar', length: 30, nullable: true, default: null })
  identificacao: string | null;

  @Column({ type: 'enum', enum: CochoTipoMaterial, nullable: true, default: null, name: 'tipo_material' })
  tipoMaterial: CochoTipoMaterial | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, name: 'capacidade_kg' })
  capacidadeKg: number;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;
}
