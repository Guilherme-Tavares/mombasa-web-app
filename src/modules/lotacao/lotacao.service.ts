import { Injectable } from '@nestjs/common';
import { Divisao } from '../divisao/divisao.entity';
import { Rebanho } from '../rebanho/rebanho.entity';
import { Lotacao } from './lotacao.entity';

@Injectable()
export class LotacaoService {
  async findAll(): Promise<Lotacao[]> {
    return Lotacao.find({
      relations: { rebanho: true, divisao: { propriedade: true } },
      order: { dataEntrada: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Lotacao | null> {
    return Lotacao.findOne({
      where: { id },
      relations: { rebanho: true, divisao: { propriedade: true } },
    });
  }

  async findAllRebanhos(): Promise<Rebanho[]> {
    return Rebanho.find({ order: { nome: 'ASC' } });
  }

  async findAllDivisoes(): Promise<Divisao[]> {
    return Divisao.find({ relations: { propriedade: true }, order: { nome: 'ASC' } });
  }

  async create(dados: any): Promise<Lotacao> {
    const lotacao = Lotacao.create({
      dataEntrada: dados.dataEntrada,
      dataSaida: dados.dataSaida || null,
      numeroCabecas: parseInt(dados.numeroCabecas),
      rebanho: { id: dados.rebanhoId } as Rebanho,
      divisao: { id: dados.divisaoId } as Divisao,
    });
    return lotacao.save();
  }

  async update(id: string, dados: any): Promise<Lotacao | null> {
    const lotacao = await Lotacao.findOne({ where: { id } });
    if (!lotacao) return null;
    Object.assign(lotacao, {
      dataEntrada: dados.dataEntrada,
      dataSaida: dados.dataSaida || null,
      numeroCabecas: parseInt(dados.numeroCabecas),
      rebanho: { id: dados.rebanhoId } as Rebanho,
      divisao: { id: dados.divisaoId } as Divisao,
    });
    return lotacao.save();
  }

  async remove(id: string): Promise<Lotacao | null> {
    const lotacao = await Lotacao.findOne({ where: { id } });
    if (!lotacao) return null;
    return lotacao.remove();
  }
}
