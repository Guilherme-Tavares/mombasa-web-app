import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { ValidationException } from '../../shared/validation.exception';
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
    await this.validarEmailUnico(dados.email, null);
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

    await this.validarEmailUnico(dados.email, id);
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

  // E-mail é opcional, mas deve ser único quando informado.
  private async validarEmailUnico(
    email: string | null | undefined,
    excludeId: string | null,
  ): Promise<void> {
    if (!email) return;
    const emUso = await Produtor.findOneBy(
      excludeId ? { email, id: Not(excludeId) } : { email },
    );
    if (emUso) {
      throw new ValidationException(`O e-mail "${email}" já está cadastrado.`);
    }
  }
}
