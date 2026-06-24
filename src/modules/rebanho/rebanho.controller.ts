import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { RebanhoService } from './rebanho.service';

@Controller('rebanhos')
export class RebanhoController {
  constructor(private readonly rebanhoService: RebanhoService) {}

  @Get()
  @Render('rebanho/list')
  async list(): Promise<object> {
    const rebanhos = await this.rebanhoService.findAll();
    return { titulo: 'Rebanhos', rebanhos };
  }

  @Get('criar')
  @Render('rebanho/form')
  async criar(): Promise<object> {
    const propriedades = await this.rebanhoService.findAllPropriedades();
    return { titulo: 'Novo Rebanho', propriedades };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.rebanhoService.create(dados);
      res.redirect('/rebanhos');
    } catch (e) {
      const propriedades = await this.rebanhoService.findAllPropriedades();
      res.status(422).render('rebanho/form', {
        titulo: 'Novo Rebanho',
        propriedades,
        rebanho: this.formValues(dados),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('rebanho/form')
  async editar(@Param('id') id: string): Promise<object> {
    const [rebanho, propriedades] = await Promise.all([
      this.rebanhoService.findOne(id),
      this.rebanhoService.findAllPropriedades(),
    ]);
    return { titulo: 'Editar Rebanho', rebanho, propriedades };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.rebanhoService.update(id, dados);
      res.redirect('/rebanhos');
    } catch (e) {
      const propriedades = await this.rebanhoService.findAllPropriedades();
      res.status(422).render('rebanho/form', {
        titulo: 'Editar Rebanho',
        propriedades,
        rebanho: { ...this.formValues(dados), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('rebanho/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const rebanho = await this.rebanhoService.findOne(id);
    return { titulo: 'Excluir Rebanho', rebanho };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.rebanhoService.remove(id);
      res.redirect('/rebanhos');
    } catch (e) {
      const rebanhos = await this.rebanhoService.findAll();
      res.status(422).render('rebanho/list', {
        titulo: 'Rebanhos',
        rebanhos,
        erro: mensagemDeErro(e),
      });
    }
  }

  private formValues(dados: any): object {
    return {
      ...dados,
      propriedade: { id: dados.propriedadeId },
      ativo: dados.ativo === '1',
    };
  }
}
