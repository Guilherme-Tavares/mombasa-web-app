import { Injectable } from '@nestjs/common';
import { Divisao } from '../divisao/divisao.entity';
import { Forragem } from './forragem.entity';

@Injectable()
export class ForragemService {
  async findAll(): Promise<Forragem[]> {
    return Forragem.find({
      relations: { divisao: { propriedade: true } },
      order: { tipo: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Forragem | null> {
    return Forragem.findOne({
      where: { id },
      relations: { divisao: { propriedade: true } },
    });
  }

  async findAllDivisoes(): Promise<Divisao[]> {
    return Divisao.find({
      relations: { propriedade: true },
      order: { nome: 'ASC' },
    });
  }

  async create(dados: any): Promise<Forragem> {
    const forragem = Forragem.create({
      tipo: dados.tipo,
      dataPlantio: dados.dataPlantio || null,
      ativa: dados.ativa === '1',
      divisao: { id: dados.divisaoId } as Divisao,
    });
    return forragem.save();
  }

  async update(id: string, dados: any): Promise<Forragem | null> {
    const forragem = await Forragem.findOne({ where: { id } });
    if (!forragem) return null;
    Object.assign(forragem, {
      tipo: dados.tipo,
      dataPlantio: dados.dataPlantio || null,
      ativa: dados.ativa === '1',
      divisao: { id: dados.divisaoId } as Divisao,
    });
    return forragem.save();
  }

  async remove(id: string): Promise<Forragem | null> {
    const forragem = await Forragem.findOne({ where: { id } });
    if (!forragem) return null;
    return forragem.remove();
  }
}
