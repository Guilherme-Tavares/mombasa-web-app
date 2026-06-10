import { Injectable } from '@nestjs/common';
import { Produtor } from '../produtor/produtor.entity';
import { Propriedade } from './propriedade.entity';

@Injectable()
export class PropriedadeService {
  async findAll(): Promise<Propriedade[]> {
    return Propriedade.find({
      relations: { produtor: true },
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Propriedade | null> {
    return Propriedade.findOne({ where: { id }, relations: { produtor: true } });
  }

  async findAllProdutores(): Promise<Produtor[]> {
    return Produtor.find({ order: { nome: 'ASC' } });
  }

  async create(dados: any): Promise<Propriedade> {
    const propriedade = Propriedade.create({
      nome: dados.nome,
      areaTotalHectares: dados.areaTotalHectares ? parseFloat(dados.areaTotalHectares) : null,
      municipio: dados.municipio || null,
      estado: dados.estado || null,
      ativa: dados.ativa === '1',
      produtor: { id: dados.produtorId } as Produtor,
    });
    return propriedade.save();
  }

  async update(id: string, dados: any): Promise<Propriedade | null> {
    const propriedade = await Propriedade.findOne({ where: { id } });
    if (!propriedade) return null;
    Object.assign(propriedade, {
      nome: dados.nome,
      areaTotalHectares: dados.areaTotalHectares ? parseFloat(dados.areaTotalHectares) : null,
      municipio: dados.municipio || null,
      estado: dados.estado || null,
      ativa: dados.ativa === '1',
      produtor: { id: dados.produtorId } as Produtor,
    });
    return propriedade.save();
  }

  async remove(id: string): Promise<Propriedade | null> {
    const propriedade = await Propriedade.findOne({ where: { id } });
    if (!propriedade) return null;
    return propriedade.remove();
  }
}
