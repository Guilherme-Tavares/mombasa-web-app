import { Injectable } from '@nestjs/common';
import { Alimento } from './alimento.entity';

@Injectable()
export class AlimentoService {
  async findAll(): Promise<Alimento[]> {
    return Alimento.find({ order: { nome: 'ASC' } });
  }

  async findOne(id: string): Promise<Alimento | null> {
    return Alimento.findOneBy({ id });
  }

  async create(dados: any): Promise<Alimento> {
    const alimento = Alimento.create({
      nome: dados.nome,
      tipo: dados.tipo,
    });
    return alimento.save();
  }

  async update(id: string, dados: any): Promise<Alimento | null> {
    const alimento = await this.findOne(id);
    if (!alimento) return null;
    Object.assign(alimento, {
      nome: dados.nome,
      tipo: dados.tipo,
    });
    return alimento.save();
  }

  async remove(id: string): Promise<Alimento | null> {
    const alimento = await this.findOne(id);
    if (!alimento) return null;
    return alimento.remove();
  }
}
