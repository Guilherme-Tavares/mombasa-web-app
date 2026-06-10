import { Injectable } from '@nestjs/common';
import { Divisao } from '../divisao/divisao.entity';
import { Cocho } from './cocho.entity';

@Injectable()
export class CochoService {
  async findAll(): Promise<Cocho[]> {
    return Cocho.find({
      relations: { divisao: { propriedade: true } },
      order: { identificacao: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Cocho | null> {
    return Cocho.findOne({
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

  async create(dados: any): Promise<Cocho> {
    const cocho = Cocho.create({
      identificacao: dados.identificacao || null,
      tipoMaterial: dados.tipoMaterial || null,
      capacidadeKg: parseFloat(dados.capacidadeKg),
      ativo: dados.ativo === '1',
      divisao: { id: dados.divisaoId } as Divisao,
    });
    return cocho.save();
  }

  async update(id: string, dados: any): Promise<Cocho | null> {
    const cocho = await Cocho.findOne({ where: { id } });
    if (!cocho) return null;
    Object.assign(cocho, {
      identificacao: dados.identificacao || null,
      tipoMaterial: dados.tipoMaterial || null,
      capacidadeKg: parseFloat(dados.capacidadeKg),
      ativo: dados.ativo === '1',
      divisao: { id: dados.divisaoId } as Divisao,
    });
    return cocho.save();
  }

  async remove(id: string): Promise<Cocho | null> {
    const cocho = await Cocho.findOne({ where: { id } });
    if (!cocho) return null;
    return cocho.remove();
  }
}
