import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { ValidationException } from '../../shared/validation.exception';
import { Alimento } from './alimento.entity';

@Injectable()
export class AlimentoService {
  async findAll(): Promise<Alimento[]> {
    return Alimento.find({ order: { nome: 'ASC' } });
  }

  async findOne(id: string): Promise<Alimento | null> {
    return Alimento.findOneBy({ id });
  }

  async create(dados: any): Promise<Alimento> {
    await this.validarNomeUnico(dados.nome, null);
    const alimento = Alimento.create({
      nome: dados.nome,
      tipo: dados.tipo,
    });
    return alimento.save();
  }

  async update(id: string, dados: any): Promise<Alimento | null> {
    const alimento = await this.findOne(id);
    if (!alimento) return null;
    await this.validarNomeUnico(dados.nome, id);
    Object.assign(alimento, {
      nome: dados.nome,
      tipo: dados.tipo,
    });
    return alimento.save();
  }

  async remove(id: string): Promise<Alimento | null> {
    const alimento = await this.findOne(id);
    if (!alimento) return null;
    return alimento.remove();
  }

  // Nome do alimento deve ser único na base.
  private async validarNomeUnico(
    nome: string,
    excludeId: string | null,
  ): Promise<void> {
    const emUso = await Alimento.findOneBy(
      excludeId ? { nome, id: Not(excludeId) } : { nome },
    );
    if (emUso) {
      throw new ValidationException(`O alimento "${nome}" já está cadastrado.`);
    }
  }
}
