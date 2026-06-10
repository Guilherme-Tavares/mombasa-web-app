import { Injectable } from '@nestjs/common';
import { Propriedade } from '../propriedade/propriedade.entity';
import { Divisao } from './divisao.entity';

@Injectable()
export class DivisaoService {
  async findAll(): Promise<Divisao[]> {
    return Divisao.find({
      relations: { propriedade: true },
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Divisao | null> {
    return Divisao.findOne({ where: { id }, relations: { propriedade: true } });
  }

  async findAllPropriedades(): Promise<Propriedade[]> {
    return Propriedade.find({ order: { nome: 'ASC' } });
  }

  async create(dados: any): Promise<Divisao> {
    const divisao = Divisao.create({
      nome: dados.nome,
      tipo: dados.tipo,
      areaHectares: dados.areaHectares ? parseFloat(dados.areaHectares) : null,
      ativa: dados.ativa === '1',
      propriedade: { id: dados.propriedadeId } as Propriedade,
    });
    return divisao.save();
  }

  async update(id: string, dados: any): Promise<Divisao | null> {
    const divisao = await Divisao.findOne({ where: { id } });
    if (!divisao) return null;
    Object.assign(divisao, {
      nome: dados.nome,
      tipo: dados.tipo,
      areaHectares: dados.areaHectares ? parseFloat(dados.areaHectares) : null,
      ativa: dados.ativa === '1',
      propriedade: { id: dados.propriedadeId } as Propriedade,
    });
    return divisao.save();
  }

  async remove(id: string): Promise<Divisao | null> {
    const divisao = await Divisao.findOne({ where: { id } });
    if (!divisao) return null;
    return divisao.remove();
  }
}
