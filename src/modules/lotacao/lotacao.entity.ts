import { randomUUID } from 'crypto';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Divisao } from '../divisao/divisao.entity';
import { Rebanho } from '../rebanho/rebanho.entity';

@Entity('lotacao')
export class Lotacao extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_lotacao' })
  id: string = randomUUID();

  @ManyToOne(() => Rebanho)
  @JoinColumn({ name: 'fk_id_rebanho' })
  rebanho: Rebanho;

  @ManyToOne(() => Divisao)
  @JoinColumn({ name: 'fk_id_divisao' })
  divisao: Divisao;

  @Column({ type: 'date', name: 'data_entrada' })
  dataEntrada: string;

  @Column({ type: 'date', nullable: true, default: null, name: 'data_saida' })
  dataSaida: string | null;

  @Column({ type: 'int', name: 'numero_cabecas' })
  numeroCabecas: number;
}
