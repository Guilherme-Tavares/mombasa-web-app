import { Injectable } from '@nestjs/common';
import { Bovino } from '../bovino/bovino.entity';
import { Medicamento } from '../medicamento/medicamento.entity';
import { AplicacaoMedicamento } from './aplicacao-medicamento.entity';

@Injectable()
export class AplicacaoMedicamentoService {
  async findAll(): Promise<AplicacaoMedicamento[]> {
    return AplicacaoMedicamento.find({
      relations: { bovino: true, medicamento: true },
      order: { dataAplicacao: 'DESC' },
    });
  }

  async findOne(id: string): Promise<AplicacaoMedicamento | null> {
    return AplicacaoMedicamento.findOne({
      where: { id },
      relations: { bovino: true, medicamento: true },
    });
  }

  async findAllBovinos(): Promise<Bovino[]> {
    return Bovino.find({ order: { nome: 'ASC' } });
  }

  async findAllMedicamentos(): Promise<Medicamento[]> {
    return Medicamento.find({ order: { nomeComercial: 'ASC' } });
  }

  async create(dados: any): Promise<AplicacaoMedicamento> {
    const aplicacao = AplicacaoMedicamento.create({
      dataAplicacao: new Date(dados.dataAplicacao),
      dose: parseFloat(dados.dose),
      unidadeDose: dados.unidadeDose,
      bovino: { id: dados.bovinoId } as Bovino,
      medicamento: { id: dados.medicamentoId } as Medicamento,
    });
    return aplicacao.save();
  }

  async update(id: string, dados: any): Promise<AplicacaoMedicamento | null> {
    const aplicacao = await AplicacaoMedicamento.findOne({ where: { id } });
    if (!aplicacao) return null;
    Object.assign(aplicacao, {
      dataAplicacao: new Date(dados.dataAplicacao),
      dose: parseFloat(dados.dose),
      unidadeDose: dados.unidadeDose,
      bovino: { id: dados.bovinoId } as Bovino,
      medicamento: { id: dados.medicamentoId } as Medicamento,
    });
    return aplicacao.save();
  }

  async remove(id: string): Promise<AplicacaoMedicamento | null> {
    const aplicacao = await AplicacaoMedicamento.findOne({ where: { id } });
    if (!aplicacao) return null;
    return aplicacao.remove();
  }
}
