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

export enum RebanhoFinalidade {
  Recria = 'recria',
  Engorda = 'engorda',
  Misto = 'misto',
}

@Entity('rebanho')
export class Rebanho extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_rebanho' })
  id: string = randomUUID();

  @ManyToOne(() => Propriedade)
  @JoinColumn({ name: 'fk_id_propriedade' })
  propriedade: Propriedade;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'enum', enum: RebanhoFinalidade })
  finalidade: RebanhoFinalidade;

  @Column({ type: 'date', name: 'data_formacao' })
  dataFormacao: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;
}
