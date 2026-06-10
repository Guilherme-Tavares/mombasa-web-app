import { Injectable } from '@nestjs/common';
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
}
