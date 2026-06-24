import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { AplicacaoMedicamentoService } from './aplicacao-medicamento.service';

@Controller('aplicacoes')
export class AplicacaoMedicamentoController {
  constructor(private readonly aplicacaoService: AplicacaoMedicamentoService) {}

  @Get()
  @Render('aplicacao/list')
  async listar() {
    const aplicacoes = await this.aplicacaoService.findAll();
    return { titulo: 'Aplicações de Medicamento', aplicacoes };
  }

  @Get('criar')
  @Render('aplicacao/form')
  async criar() {
    const [bovinos, medicamentos] = await Promise.all([
      this.aplicacaoService.findAllBovinos(),
      this.aplicacaoService.findAllMedicamentos(),
    ]);
    const agora = new Date().toLocaleString('sv-SE').replace(' ', 'T').slice(0, 16);
    return { titulo: 'Nova Aplicação', bovinos, medicamentos, agora };
  }

  @Post('criar')
  async criarPost(@Body() body: any, @Res() res: Response): Promise<void> {
    try {
      await this.aplicacaoService.create(body);
      res.redirect('/aplicacoes');
    } catch (e) {
      const [bovinos, medicamentos] = await Promise.all([
        this.aplicacaoService.findAllBovinos(),
        this.aplicacaoService.findAllMedicamentos(),
      ]);
      res.status(422).render('aplicacao/form', {
        titulo: 'Nova Aplicação',
        bovinos,
        medicamentos,
        aplicacao: this.formValues(body),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('aplicacao/form')
  async editar(@Param('id') id: string) {
    const [aplicacao, bovinos, medicamentos] = await Promise.all([
      this.aplicacaoService.findOne(id),
      this.aplicacaoService.findAllBovinos(),
      this.aplicacaoService.findAllMedicamentos(),
    ]);
    return { titulo: 'Editar Aplicação', aplicacao, bovinos, medicamentos };
  }

  @Post(':id/editar')
  async editarPost(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.aplicacaoService.update(id, body);
      res.redirect('/aplicacoes');
    } catch (e) {
      const [bovinos, medicamentos] = await Promise.all([
        this.aplicacaoService.findAllBovinos(),
        this.aplicacaoService.findAllMedicamentos(),
      ]);
      res.status(422).render('aplicacao/form', {
        titulo: 'Editar Aplicação',
        bovinos,
        medicamentos,
        aplicacao: { ...this.formValues(body), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('aplicacao/delete')
  async excluir(@Param('id') id: string) {
    const aplicacao = await this.aplicacaoService.findOne(id);
    return { titulo: 'Excluir Aplicação', aplicacao };
  }

  @Post(':id/excluir')
  async excluirPost(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.aplicacaoService.remove(id);
      res.redirect('/aplicacoes');
    } catch (e) {
      const aplicacoes = await this.aplicacaoService.findAll();
      res.status(422).render('aplicacao/list', {
        titulo: 'Aplicações de Medicamento',
        aplicacoes,
        erro: mensagemDeErro(e),
      });
    }
  }

  private formValues(body: any): object {
    return {
      ...body,
      bovino: { id: body.bovinoId },
      medicamento: { id: body.medicamentoId },
    };
  }
}
