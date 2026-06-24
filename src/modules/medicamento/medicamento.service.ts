import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { ValidationException } from '../../shared/validation.exception';
import { Medicamento } from './medicamento.entity';

@Injectable()
export class MedicamentoService {
  async findAll(): Promise<Medicamento[]> {
    return Medicamento.find({ order: { nomeComercial: 'ASC' } });
  }

  async findOne(id: string): Promise<Medicamento | null> {
    return Medicamento.findOneBy({ id });
  }

  async create(dados: any): Promise<Medicamento> {
    await this.validarNomeComercialUnico(dados.nomeComercial, null);
    const medicamento = Medicamento.create({
      nomeComercial: dados.nomeComercial,
      principioAtivo: dados.principioAtivo || null,
      tipo: dados.tipo,
    });
    return medicamento.save();
  }

  async update(id: string, dados: any): Promise<Medicamento | null> {
    const medicamento = await this.findOne(id);
    if (!medicamento) return null;
    await this.validarNomeComercialUnico(dados.nomeComercial, id);
    Object.assign(medicamento, {
      nomeComercial: dados.nomeComercial,
      principioAtivo: dados.principioAtivo || null,
      tipo: dados.tipo,
    });
    return medicamento.save();
  }

  // Nome comercial deve ser único na base (ignora o próprio registro na edição).
  private async validarNomeComercialUnico(
    nomeComercial: string,
    excludeId: string | null,
  ): Promise<void> {
    const emUso = await Medicamento.findOneBy(
      excludeId ? { nomeComercial, id: Not(excludeId) } : { nomeComercial },
    );
    if (emUso) {
      throw new ValidationException(
        `O nome comercial "${nomeComercial}" já está cadastrado.`,
      );
    }
  }

  async remove(id: string): Promise<Medicamento | null> {
    const medicamento = await this.findOne(id);
    if (!medicamento) return null;
    return medicamento.remove();
  }
}
