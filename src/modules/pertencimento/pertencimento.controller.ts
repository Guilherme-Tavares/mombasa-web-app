import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { PertencimentoService } from './pertencimento.service';

@Controller('pertencimentos')
export class PertencimentoController {
  constructor(private readonly pertencimentoService: PertencimentoService) {}

  @Get()
  @Render('pertencimento/list')
  async listar() {
    const pertencimentos = await this.pertencimentoService.findAll();
    return { titulo: 'Pertencimentos', pertencimentos };
  }

  @Get('criar')
  @Render('pertencimento/form')
  async criar() {
    const [bovinos, rebanhos] = await Promise.all([
      this.pertencimentoService.findAllBovinos(),
      this.pertencimentoService.findAllRebanhos(),
    ]);
    const hoje = new Date().toISOString().split('T')[0];
    return { titulo: 'Novo Pertencimento', bovinos, rebanhos, hoje };
  }

  @Post('criar')
  async criarPost(@Body() body: any, @Res() res: Response): Promise<void> {
    try {
      await this.pertencimentoService.create(body);
      res.redirect('/pertencimentos');
    } catch (e) {
      const [bovinos, rebanhos] = await Promise.all([
        this.pertencimentoService.findAllBovinos(),
        this.pertencimentoService.findAllRebanhos(),
      ]);
      res.status(422).render('pertencimento/form', {
        titulo: 'Novo Pertencimento',
        bovinos,
        rebanhos,
        pertencimento: this.formValues(body),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('pertencimento/form')
  async editar(@Param('id') id: string) {
    const [pertencimento, bovinos, rebanhos] = await Promise.all([
      this.pertencimentoService.findOne(id),
      this.pertencimentoService.findAllBovinos(),
      this.pertencimentoService.findAllRebanhos(),
    ]);
    return { titulo: 'Editar Pertencimento', pertencimento, bovinos, rebanhos };
  }

  @Post(':id/editar')
  async editarPost(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.pertencimentoService.update(id, body);
      res.redirect('/pertencimentos');
    } catch (e) {
      const [bovinos, rebanhos] = await Promise.all([
        this.pertencimentoService.findAllBovinos(),
        this.pertencimentoService.findAllRebanhos(),
      ]);
      res.status(422).render('pertencimento/form', {
        titulo: 'Editar Pertencimento',
        bovinos,
        rebanhos,
        pertencimento: { ...this.formValues(body), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('pertencimento/delete')
  async excluir(@Param('id') id: string) {
    const pertencimento = await this.pertencimentoService.findOne(id);
    return { titulo: 'Excluir Pertencimento', pertencimento };
  }

  @Post(':id/excluir')
  async excluirPost(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.pertencimentoService.remove(id);
      res.redirect('/pertencimentos');
    } catch (e) {
      const pertencimentos = await this.pertencimentoService.findAll();
      res.status(422).render('pertencimento/list', {
        titulo: 'Pertencimentos',
        pertencimentos,
        erro: mensagemDeErro(e),
      });
    }
  }

  private formValues(body: any): object {
    return {
      ...body,
      bovino: { id: body.bovinoId },
      rebanho: { id: body.rebanhoId },
    };
  }
}
