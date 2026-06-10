import { Injectable } from '@nestjs/common';
import { Temporada } from './temporada.entity';

@Injectable()
export class TemporadaService {
  async findAll(): Promise<Temporada[]> {
    return Temporada.find({ order: { nome: 'ASC' } });
  }

  async findOne(id: string): Promise<Temporada | null> {
    return Temporada.findOneBy({ id });
  }

  async create(dados: any): Promise<Temporada> {
    const temporada = Temporada.create({
      nome: dados.nome,
      tipo: dados.tipo,
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim,
    });
    return temporada.save();
  }

  async update(id: string, dados: any): Promise<Temporada | null> {
    const temporada = await this.findOne(id);
    if (!temporada) return null;
    Object.assign(temporada, {
      nome: dados.nome,
      tipo: dados.tipo,
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim,
    });
    return temporada.save();
  }

  async remove(id: string): Promise<Temporada | null> {
    const temporada = await this.findOne(id);
    if (!temporada) return null;
    return temporada.remove();
  }
}
