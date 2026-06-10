import { Injectable } from '@nestjs/common';
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
    Object.assign(medicamento, {
      nomeComercial: dados.nomeComercial,
      principioAtivo: dados.principioAtivo || null,
      tipo: dados.tipo,
    });
    return medicamento.save();
  }

  async remove(id: string): Promise<Medicamento | null> {
    const medicamento = await this.findOne(id);
    if (!medicamento) return null;
    return medicamento.remove();
  }
}
