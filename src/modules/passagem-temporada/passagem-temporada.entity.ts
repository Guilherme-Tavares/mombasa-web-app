import { randomUUID } from 'crypto';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Rebanho } from '../rebanho/rebanho.entity';
import { Temporada } from '../temporada/temporada.entity';

@Entity('passagem_temporada')
export class PassagemTemporada extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_passagem' })
  id: string = randomUUID();

  @ManyToOne(() => Rebanho)
  @JoinColumn({ name: 'fk_id_rebanho' })
  rebanho: Rebanho;

  @ManyToOne(() => Temporada)
  @JoinColumn({ name: 'fk_id_temporada' })
  temporada: Temporada;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, default: null, name: 'peso_medio_inicial_kg' })
  pesoMedioInicialKg: number | null;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, default: null, name: 'peso_medio_final_kg' })
  pesoMedioFinalKg: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 3, nullable: true, default: null, name: 'gmd_medio_kg' })
  gmdMedioKg: number | null;
}
