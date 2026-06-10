import { randomUUID } from 'crypto';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Bovino } from '../bovino/bovino.entity';
import { Rebanho } from '../rebanho/rebanho.entity';

@Entity('pertencimento')
export class Pertencimento extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_pertencimento' })
  id: string = randomUUID();

  @ManyToOne(() => Bovino)
  @JoinColumn({ name: 'fk_id_bovino' })
  bovino: Bovino;

  @ManyToOne(() => Rebanho)
  @JoinColumn({ name: 'fk_id_rebanho' })
  rebanho: Rebanho;

  @Column({ type: 'date', name: 'data_entrada' })
  dataEntrada: string;

  @Column({ type: 'date', nullable: true, default: null, name: 'data_saida' })
  dataSaida: string | null;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, default: null, name: 'peso_entrada_kg' })
  pesoEntradaKg: number | null;
}
