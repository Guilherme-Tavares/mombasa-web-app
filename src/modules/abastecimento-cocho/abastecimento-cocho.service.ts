import { Injectable } from '@nestjs/common';
import { Alimento } from '../alimento/alimento.entity';
import { Cocho } from '../cocho/cocho.entity';
import { AbastecimentoCocho } from './abastecimento-cocho.entity';

@Injectable()
export class AbastecimentoCochoService {
  async findAll(): Promise<AbastecimentoCocho[]> {
    return AbastecimentoCocho.find({
      relations: { cocho: { divisao: true }, alimento: true },
      order: { dataAbastecimento: 'DESC' },
    });
  }

  async findOne(id: string): Promise<AbastecimentoCocho | null> {
    return AbastecimentoCocho.findOne({
      where: { id },
      relations: { cocho: { divisao: true }, alimento: true },
    });
  }

  async findAllCochos(): Promise<Cocho[]> {
    return Cocho.find({ relations: { divisao: true }, order: { identificacao: 'ASC' } });
  }

  async findAllAlimentos(): Promise<Alimento[]> {
    return Alimento.find({ order: { nome: 'ASC' } });
  }

  async create(dados: any): Promise<AbastecimentoCocho> {
    const abastecimento = AbastecimentoCocho.create({
      dataAbastecimento: new Date(dados.dataAbastecimento),
      quantidadeInicialKg: parseFloat(dados.quantidadeInicialKg),
      quantidadeRestanteKg: parseFloat(dados.quantidadeRestanteKg),
      esgotado: dados.esgotado === '1',
      cocho: { id: dados.cochoId } as Cocho,
      alimento: { id: dados.alimentoId } as Alimento,
    });
    return abastecimento.save();
  }

  async update(id: string, dados: any): Promise<AbastecimentoCocho | null> {
    const abastecimento = await AbastecimentoCocho.findOne({ where: { id } });
    if (!abastecimento) return null;
    Object.assign(abastecimento, {
      dataAbastecimento: new Date(dados.dataAbastecimento),
      quantidadeInicialKg: parseFloat(dados.quantidadeInicialKg),
      quantidadeRestanteKg: parseFloat(dados.quantidadeRestanteKg),
      esgotado: dados.esgotado === '1',
      cocho: { id: dados.cochoId } as Cocho,
      alimento: { id: dados.alimentoId } as Alimento,
    });
    return abastecimento.save();
  }

  async remove(id: string): Promise<AbastecimentoCocho | null> {
    const abastecimento = await AbastecimentoCocho.findOne({ where: { id } });
    if (!abastecimento) return null;
    return abastecimento.remove();
  }
}
