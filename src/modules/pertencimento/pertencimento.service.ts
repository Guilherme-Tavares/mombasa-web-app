import { Injectable } from '@nestjs/common';
import { Bovino } from '../bovino/bovino.entity';
import { Rebanho } from '../rebanho/rebanho.entity';
import { Pertencimento } from './pertencimento.entity';

@Injectable()
export class PertencimentoService {
  async findAll(): Promise<Pertencimento[]> {
    return Pertencimento.find({
      relations: { bovino: true, rebanho: true },
      order: { dataEntrada: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Pertencimento | null> {
    return Pertencimento.findOne({
      where: { id },
      relations: { bovino: true, rebanho: true },
    });
  }

  async findAllBovinos(): Promise<Bovino[]> {
    return Bovino.find({ order: { nome: 'ASC' } });
  }

  async findAllRebanhos(): Promise<Rebanho[]> {
    return Rebanho.find({ order: { nome: 'ASC' } });
  }

  async create(dados: any): Promise<Pertencimento> {
    const pertencimento = Pertencimento.create({
      dataEntrada: dados.dataEntrada,
      dataSaida: dados.dataSaida || null,
      pesoEntradaKg: dados.pesoEntradaKg ? parseFloat(dados.pesoEntradaKg) : null,
      bovino: { id: dados.bovinoId } as Bovino,
      rebanho: { id: dados.rebanhoId } as Rebanho,
    });
    return pertencimento.save();
  }

  async update(id: string, dados: any): Promise<Pertencimento | null> {
    const pertencimento = await Pertencimento.findOne({ where: { id } });
    if (!pertencimento) return null;
    Object.assign(pertencimento, {
      dataEntrada: dados.dataEntrada,
      dataSaida: dados.dataSaida || null,
      pesoEntradaKg: dados.pesoEntradaKg ? parseFloat(dados.pesoEntradaKg) : null,
      bovino: { id: dados.bovinoId } as Bovino,
      rebanho: { id: dados.rebanhoId } as Rebanho,
    });
    return pertencimento.save();
  }

  async remove(id: string): Promise<Pertencimento | null> {
    const pertencimento = await Pertencimento.findOne({ where: { id } });
    if (!pertencimento) return null;
    return pertencimento.remove();
  }
}
