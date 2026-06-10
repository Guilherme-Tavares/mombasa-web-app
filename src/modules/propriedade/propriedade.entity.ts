import { randomUUID } from 'crypto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Produtor } from '../produtor/produtor.entity';

@Entity('propriedade')
export class Propriedade extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_propriedade' })
  id: string = randomUUID();

  @ManyToOne(() => Produtor)
  @JoinColumn({ name: 'fk_id_produtor' })
  produtor: Produtor;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: null, name: 'area_total_hectares' })
  areaTotalHectares: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  municipio: string | null;

  @Column({ type: 'char', length: 2, nullable: true, default: null })
  estado: string | null;

  @CreateDateColumn({ name: 'data_cadastro' })
  dataCadastro: Date;

  @Column({ type: 'boolean', default: true })
  ativa: boolean;
}
