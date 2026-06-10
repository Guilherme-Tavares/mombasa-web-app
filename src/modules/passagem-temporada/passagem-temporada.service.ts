import { Injectable } from '@nestjs/common';
import { Rebanho } from '../rebanho/rebanho.entity';
import { Temporada } from '../temporada/temporada.entity';
import { PassagemTemporada } from './passagem-temporada.entity';

@Injectable()
export class PassagemTemporadaService {
  async findAll(): Promise<PassagemTemporada[]> {
    return PassagemTemporada.find({
      relations: { rebanho: true, temporada: true },
    });
  }

  async findOne(id: string): Promise<PassagemTemporada | null> {
    return PassagemTemporada.findOne({
      where: { id },
      relations: { rebanho: true, temporada: true },
    });
  }

  async findAllRebanhos(): Promise<Rebanho[]> {
    return Rebanho.find({ order: { nome: 'ASC' } });
  }

  async findAllTemporadas(): Promise<Temporada[]> {
    return Temporada.find({ order: { nome: 'ASC' } });
  }

  async create(dados: any): Promise<PassagemTemporada> {
    const passagem = PassagemTemporada.create({
      pesoMedioInicialKg: dados.pesoMedioInicialKg ? parseFloat(dados.pesoMedioInicialKg) : null,
      pesoMedioFinalKg: dados.pesoMedioFinalKg ? parseFloat(dados.pesoMedioFinalKg) : null,
      gmdMedioKg: dados.gmdMedioKg ? parseFloat(dados.gmdMedioKg) : null,
      rebanho: { id: dados.rebanhoId } as Rebanho,
      temporada: { id: dados.temporadaId } as Temporada,
    });
    return passagem.save();
  }

  async update(id: string, dados: any): Promise<PassagemTemporada | null> {
    const passagem = await PassagemTemporada.findOne({ where: { id } });
    if (!passagem) return null;
    Object.assign(passagem, {
      pesoMedioInicialKg: dados.pesoMedioInicialKg ? parseFloat(dados.pesoMedioInicialKg) : null,
      pesoMedioFinalKg: dados.pesoMedioFinalKg ? parseFloat(dados.pesoMedioFinalKg) : null,
      gmdMedioKg: dados.gmdMedioKg ? parseFloat(dados.gmdMedioKg) : null,
      rebanho: { id: dados.rebanhoId } as Rebanho,
      temporada: { id: dados.temporadaId } as Temporada,
    });
    return passagem.save();
  }

  async remove(id: string): Promise<PassagemTemporada | null> {
    const passagem = await PassagemTemporada.findOne({ where: { id } });
    if (!passagem) return null;
    return passagem.remove();
  }
}
