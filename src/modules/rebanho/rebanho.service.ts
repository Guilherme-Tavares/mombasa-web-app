import { Injectable } from '@nestjs/common';
import { Propriedade } from '../propriedade/propriedade.entity';
import { Rebanho } from './rebanho.entity';

@Injectable()
export class RebanhoService {
  async findAll(): Promise<Rebanho[]> {
    return Rebanho.find({
      relations: { propriedade: true },
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Rebanho | null> {
    return Rebanho.findOne({ where: { id }, relations: { propriedade: true } });
  }

  async findAllPropriedades(): Promise<Propriedade[]> {
    return Propriedade.find({ order: { nome: 'ASC' } });
  }

  async create(dados: any): Promise<Rebanho> {
    const rebanho = Rebanho.create({
      nome: dados.nome,
      finalidade: dados.finalidade,
      dataFormacao: dados.dataFormacao,
      ativo: dados.ativo === '1',
      propriedade: { id: dados.propriedadeId } as Propriedade,
    });
    return rebanho.save();
  }

  async update(id: string, dados: any): Promise<Rebanho | null> {
    const rebanho = await Rebanho.findOne({ where: { id } });
    if (!rebanho) return null;
    Object.assign(rebanho, {
      nome: dados.nome,
      finalidade: dados.finalidade,
      dataFormacao: dados.dataFormacao,
      ativo: dados.ativo === '1',
      propriedade: { id: dados.propriedadeId } as Propriedade,
    });
    return rebanho.save();
  }

  async remove(id: string): Promise<Rebanho | null> {
    const rebanho = await Rebanho.findOne({ where: { id } });
    if (!rebanho) return null;
    return rebanho.remove();
  }
}
