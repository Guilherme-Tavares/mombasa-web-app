import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { DivisaoService } from './divisao.service';

@Controller('divisoes')
export class DivisaoController {
  constructor(private readonly divisaoService: DivisaoService) {}

  @Get()
  @Render('divisao/list')
  async list(): Promise<object> {
    const divisoes = await this.divisaoService.findAll();
    return { titulo: 'Divisões', divisoes };
  }

  @Get('criar')
  @Render('divisao/form')
  async criar(): Promise<object> {
    const propriedades = await this.divisaoService.findAllPropriedades();
    return { titulo: 'Nova Divisão', propriedades };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.divisaoService.create(dados);
      res.redirect('/divisoes');
    } catch (e) {
      const propriedades = await this.divisaoService.findAllPropriedades();
      res.status(422).render('divisao/form', {
        titulo: 'Nova Divisão',
        propriedades,
        divisao: this.formValues(dados),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('divisao/form')
  async editar(@Param('id') id: string): Promise<object> {
    const [divisao, propriedades] = await Promise.all([
      this.divisaoService.findOne(id),
      this.divisaoService.findAllPropriedades(),
    ]);
    return { titulo: 'Editar Divisão', divisao, propriedades };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.divisaoService.update(id, dados);
      res.redirect('/divisoes');
    } catch (e) {
      const propriedades = await this.divisaoService.findAllPropriedades();
      res.status(422).render('divisao/form', {
        titulo: 'Editar Divisão',
        propriedades,
        divisao: { ...this.formValues(dados), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('divisao/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const divisao = await this.divisaoService.findOne(id);
    return { titulo: 'Excluir Divisão', divisao };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.divisaoService.remove(id);
      res.redirect('/divisoes');
    } catch (e) {
      const divisoes = await this.divisaoService.findAll();
      res.status(422).render('divisao/list', {
        titulo: 'Divisões',
        divisoes,
        erro: mensagemDeErro(e),
      });
    }
  }

  private formValues(dados: any): object {
    return {
      ...dados,
      propriedade: { id: dados.propriedadeId },
      ativa: dados.ativa === '1',
    };
  }
}
