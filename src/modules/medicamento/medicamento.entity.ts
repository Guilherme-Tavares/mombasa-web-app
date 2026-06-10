import { randomUUID } from 'crypto';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

export enum MedicamentoTipo {
  Antibiotico = 'antibiotico',
  Antiparasitario = 'antiparasitario',
  Vitamina = 'vitamina',
  Vacina = 'vacina',
  Outro = 'outro',
}

@Entity('medicamento')
export class Medicamento extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_medicamento' })
  id: string = randomUUID();

  @Column({ type: 'varchar', length: 100, unique: true, name: 'nome_comercial' })
  nomeComercial: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null, name: 'principio_ativo' })
  principioAtivo: string | null;

  @Column({ type: 'enum', enum: MedicamentoTipo })
  tipo: MedicamentoTipo;
}
