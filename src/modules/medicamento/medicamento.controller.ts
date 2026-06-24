import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { MedicamentoService } from './medicamento.service';

@Controller('medicamentos')
export class MedicamentoController {
  constructor(private readonly medicamentoService: MedicamentoService) {}

  @Get()
  @Render('medicamento/list')
  async list(): Promise<object> {
    const medicamentos = await this.medicamentoService.findAll();
    return { titulo: 'Medicamentos', medicamentos };
  }

  @Get('criar')
  @Render('medicamento/form')
  criar(): object {
    return { titulo: 'Novo Medicamento' };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.medicamentoService.create(dados);
      res.redirect('/medicamentos');
    } catch (e) {
      res.status(422).render('medicamento/form', {
        titulo: 'Novo Medicamento',
        medicamento: dados,
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('medicamento/form')
  async editar(@Param('id') id: string): Promise<object> {
    const medicamento = await this.medicamentoService.findOne(id);
    return { titulo: 'Editar Medicamento', medicamento };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.medicamentoService.update(id, dados);
      res.redirect('/medicamentos');
    } catch (e) {
      res.status(422).render('medicamento/form', {
        titulo: 'Editar Medicamento',
        medicamento: { ...dados, id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('medicamento/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const medicamento = await this.medicamentoService.findOne(id);
    return { titulo: 'Excluir Medicamento', medicamento };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.medicamentoService.remove(id);
      res.redirect('/medicamentos');
    } catch (e) {
      // Falha ao excluir (ex.: medicamento referenciado em estoque/aplicação):
      // volta à listagem com a mensagem.
      const medicamentos = await this.medicamentoService.findAll();
      res.status(422).render('medicamento/list', {
        titulo: 'Medicamentos',
        medicamentos,
        erro: mensagemDeErro(e),
      });
    }
  }
}
