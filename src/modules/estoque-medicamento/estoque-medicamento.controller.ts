import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { EstoqueMedicamentoService } from './estoque-medicamento.service';

@Controller('estoques')
export class EstoqueMedicamentoController {
  constructor(private readonly estoqueService: EstoqueMedicamentoService) {}

  @Get()
  @Render('estoque/list')
  async list(): Promise<object> {
    const estoques = await this.estoqueService.findAll();
    return { titulo: 'Estoque de Medicamentos', estoques };
  }

  @Get('criar')
  @Render('estoque/form')
  async criar(): Promise<object> {
    const [propriedades, medicamentos] = await Promise.all([
      this.estoqueService.findAllPropriedades(),
      this.estoqueService.findAllMedicamentos(),
    ]);
    const hoje = new Date().toISOString().split('T')[0];
    return { titulo: 'Nova Entrada de Estoque', propriedades, medicamentos, hoje };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.estoqueService.create(dados);
      res.redirect('/estoques');
    } catch (e) {
      const [propriedades, medicamentos] = await Promise.all([
        this.estoqueService.findAllPropriedades(),
        this.estoqueService.findAllMedicamentos(),
      ]);
      res.status(422).render('estoque/form', {
        titulo: 'Nova Entrada de Estoque',
        propriedades,
        medicamentos,
        estoque: this.formValues(dados),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('estoque/form')
  async editar(@Param('id') id: string): Promise<object> {
    const [estoque, propriedades, medicamentos] = await Promise.all([
      this.estoqueService.findOne(id),
      this.estoqueService.findAllPropriedades(),
      this.estoqueService.findAllMedicamentos(),
    ]);
    return { titulo: 'Editar Estoque', estoque, propriedades, medicamentos };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.estoqueService.update(id, dados);
      res.redirect('/estoques');
    } catch (e) {
      const [propriedades, medicamentos] = await Promise.all([
        this.estoqueService.findAllPropriedades(),
        this.estoqueService.findAllMedicamentos(),
      ]);
      res.status(422).render('estoque/form', {
        titulo: 'Editar Estoque',
        propriedades,
        medicamentos,
        estoque: { ...this.formValues(dados), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('estoque/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const estoque = await this.estoqueService.findOne(id);
    return { titulo: 'Excluir Registro de Estoque', estoque };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.estoqueService.remove(id);
      res.redirect('/estoques');
    } catch (e) {
      const estoques = await this.estoqueService.findAll();
      res.status(422).render('estoque/list', {
        titulo: 'Estoque de Medicamentos',
        estoques,
        erro: mensagemDeErro(e),
      });
    }
  }

  private formValues(dados: any): object {
    return {
      ...dados,
      propriedade: { id: dados.propriedadeId },
      medicamento: { id: dados.medicamentoId },
    };
  }
}
