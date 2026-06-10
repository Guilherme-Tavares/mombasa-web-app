import { randomUUID } from 'crypto';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

export enum BovinoSexo {
  M = 'M',
  F = 'F',
}

export enum BovinoOrigem {
  Comprado = 'comprado',
  Doacao = 'doacao',
}

@Entity('bovino')
export class Bovino extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_bovino' })
  id: string = randomUUID();

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true, default: null })
  brinco: string | null;

  @Column({ type: 'varchar', length: 50 })
  nome: string;

  @Column({ type: 'enum', enum: BovinoSexo })
  sexo: BovinoSexo;

  @Column({ type: 'varchar', length: 50, nullable: true, default: null })
  raca: string | null;

  @Column({ type: 'date', nullable: true, default: null, name: 'data_nascimento' })
  dataNascimento: string | null;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, default: null, name: 'peso_atual_kg' })
  pesoAtualKg: number | null;

  @Column({ type: 'date', nullable: true, default: null, name: 'data_ultima_pesagem' })
  dataUltimaPesagem: string | null;

  @Column({ type: 'enum', enum: BovinoOrigem, nullable: true, default: null })
  origem: BovinoOrigem | null;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;
}
