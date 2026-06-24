import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { ValidationException } from '../../shared/validation.exception';
import { Bovino } from './bovino.entity';

@Injectable()
export class BovinoService {
  async findAll(): Promise<Bovino[]> {
    return Bovino.find({ order: { nome: 'ASC' } });
  }

  async findOne(id: string): Promise<Bovino | null> {
    return Bovino.findOneBy({ id });
  }

  async create(dados: any): Promise<Bovino> {
    await this.validarBrincoUnico(dados.brinco, null);
    const bovino = Bovino.create({
      brinco: dados.brinco || null,
      nome: dados.nome,
      sexo: dados.sexo,
      raca: dados.raca || null,
      dataNascimento: dados.dataNascimento || null,
      pesoAtualKg: dados.pesoAtualKg ? parseFloat(dados.pesoAtualKg) : null,
      dataUltimaPesagem: dados.dataUltimaPesagem || null,
      origem: dados.origem || null,
      ativo: dados.ativo === '1',
    });
    return bovino.save();
  }

  async update(id: string, dados: any): Promise<Bovino | null> {
    const bovino = await this.findOne(id);
    if (!bovino) return null;
    await this.validarBrincoUnico(dados.brinco, id);
    Object.assign(bovino, {
      brinco: dados.brinco || null,
      nome: dados.nome,
      sexo: dados.sexo,
      raca: dados.raca || null,
      dataNascimento: dados.dataNascimento || null,
      pesoAtualKg: dados.pesoAtualKg ? parseFloat(dados.pesoAtualKg) : null,
      dataUltimaPesagem: dados.dataUltimaPesagem || null,
      origem: dados.origem || null,
      ativo: dados.ativo === '1',
    });
    return bovino.save();
  }

  async remove(id: string): Promise<Bovino | null> {
    const bovino = await this.findOne(id);
    if (!bovino) return null;
    return bovino.remove();
  }

  // Brinco é opcional, mas deve ser único quando informado.
  private async validarBrincoUnico(
    brinco: string | null | undefined,
    excludeId: string | null,
  ): Promise<void> {
    if (!brinco) return;
    const emUso = await Bovino.findOneBy(
      excludeId ? { brinco, id: Not(excludeId) } : { brinco },
    );
    if (emUso) {
      throw new ValidationException(`O brinco "${brinco}" já está em uso.`);
    }
  }
}
