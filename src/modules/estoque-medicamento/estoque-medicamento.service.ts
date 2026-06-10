import { Injectable } from '@nestjs/common';
import { Medicamento } from '../medicamento/medicamento.entity';
import { Propriedade } from '../propriedade/propriedade.entity';
import { EstoqueMedicamento } from './estoque-medicamento.entity';

@Injectable()
export class EstoqueMedicamentoService {
  async findAll(): Promise<EstoqueMedicamento[]> {
    return EstoqueMedicamento.find({
      relations: { propriedade: true, medicamento: true },
      order: { dataEntrada: 'DESC' },
    });
  }

  async findOne(id: string): Promise<EstoqueMedicamento | null> {
    return EstoqueMedicamento.findOne({
      where: { id },
      relations: { propriedade: true, medicamento: true },
    });
  }

  async findAllPropriedades(): Promise<Propriedade[]> {
    return Propriedade.find({ order: { nome: 'ASC' } });
  }

  async findAllMedicamentos(): Promise<Medicamento[]> {
    return Medicamento.find({ order: { nomeComercial: 'ASC' } });
  }

  async create(dados: any): Promise<EstoqueMedicamento> {
    const estoque = EstoqueMedicamento.create({
      quantidade: parseFloat(dados.quantidade),
      unidade: dados.unidade,
      dataEntrada: dados.dataEntrada,
      estoqueMinimo: dados.estoqueMinimo ? parseFloat(dados.estoqueMinimo) : 0,
      propriedade: { id: dados.propriedadeId } as Propriedade,
      medicamento: { id: dados.medicamentoId } as Medicamento,
    });
    return estoque.save();
  }

  async update(id: string, dados: any): Promise<EstoqueMedicamento | null> {
    const estoque = await EstoqueMedicamento.findOne({ where: { id } });
    if (!estoque) return null;
    Object.assign(estoque, {
      quantidade: parseFloat(dados.quantidade),
      unidade: dados.unidade,
      dataEntrada: dados.dataEntrada,
      estoqueMinimo: dados.estoqueMinimo ? parseFloat(dados.estoqueMinimo) : 0,
      propriedade: { id: dados.propriedadeId } as Propriedade,
      medicamento: { id: dados.medicamentoId } as Medicamento,
    });
    return estoque.save();
  }

  async remove(id: string): Promise<EstoqueMedicamento | null> {
    const estoque = await EstoqueMedicamento.findOne({ where: { id } });
    if (!estoque) return null;
    return estoque.remove();
  }
}
