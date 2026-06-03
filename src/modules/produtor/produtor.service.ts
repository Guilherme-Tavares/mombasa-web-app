import { Injectable } from '@nestjs/common';
import { Produtor } from './produtor.entity';

@Injectable()
export class ProdutorService {
  async findAll(): Promise<Produtor[]> {
    return Produtor.find({ order: { nome: 'ASC' } });
  }

  async findOne(id: string): Promise<Produtor | null> {
    return Produtor.findOneBy({ id });
  }

  async create(dados: any): Promise<Produtor> {
    const produtor = Produtor.create({
      nome: dados.nome,
      email: dados.email || null,
      telefone: dados.telefone || null,
      senha: dados.senha || null,
    });
    return produtor.save();
  }

  async update(id: string, dados: any): Promise<Produtor | null> {
    const produtor = await this.findOne(id);
    if (!produtor) return null;

    Object.assign(produtor, {
      nome: dados.nome,
      email: dados.email || null,
      telefone: dados.telefone || null,
      senha: dados.senha || null,
    });

    return produtor.save();
  }

  async remove(id: string): Promise<Produtor | null> {
    const produtor = await this.findOne(id);
    if (!produtor) return null;
    return produtor.remove();
  }
}
