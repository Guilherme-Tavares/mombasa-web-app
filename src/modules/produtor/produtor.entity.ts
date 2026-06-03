import { randomUUID } from 'crypto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('produtor')
export class Produtor extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, name: 'id_produtor' })
  id: string = randomUUID();

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true, default: null })
  email: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, default: null })
  telefone: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true, default: null })
  senha: string | null;

  @CreateDateColumn({ name: 'data_cadastro' })
  dataCadastro: Date;
}
