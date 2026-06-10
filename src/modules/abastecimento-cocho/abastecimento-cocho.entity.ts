import { randomUUID } from 'crypto';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Alimento } from '../alimento/alimento.entity';
import { Cocho } from '../cocho/cocho.entity';

@Entity('abastecimento_cocho')
export class AbastecimentoCocho extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_abastecimento' })
  id: string = randomUUID();

  @ManyToOne(() => Cocho)
  @JoinColumn({ name: 'fk_id_cocho' })
  cocho: Cocho;

  @ManyToOne(() => Alimento)
  @JoinColumn({ name: 'fk_id_alimento' })
  alimento: Alimento;

  @Column({ type: 'datetime', name: 'data_abastecimento' })
  dataAbastecimento: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2, name: 'quantidade_inicial_kg' })
  quantidadeInicialKg: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, name: 'quantidade_restante_kg' })
  quantidadeRestanteKg: number;

  @Column({ type: 'boolean', default: false })
  esgotado: boolean;
}
