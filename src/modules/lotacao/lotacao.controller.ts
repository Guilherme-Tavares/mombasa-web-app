import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { LotacaoService } from './lotacao.service';

@Controller('lotacoes')
export class LotacaoController {
  constructor(private readonly lotacaoService: LotacaoService) {}

  @Get()
  @Render('lotacao/list')
  async listar() {
    const lotacoes = await this.lotacaoService.findAll();
    return { titulo: 'Lotações', lotacoes };
  }

  @Get('criar')
  @Render('lotacao/form')
  async criar() {
    const [rebanhos, divisoes] = await Promise.all([
      this.lotacaoService.findAllRebanhos(),
      this.lotacaoService.findAllDivisoes(),
    ]);
    const hoje = new Date().toISOString().split('T')[0];
    return { titulo: 'Nova Lotação', rebanhos, divisoes, hoje };
  }

  @Post('criar')
  async criarPost(@Body() body: any, @Res() res: Response): Promise<void> {
    try {
      await this.lotacaoService.create(body);
      res.redirect('/lotacoes');
    } catch (e) {
      const [rebanhos, divisoes] = await Promise.all([
        this.lotacaoService.findAllRebanhos(),
        this.lotacaoService.findAllDivisoes(),
      ]);
      res.status(422).render('lotacao/form', {
        titulo: 'Nova Lotação',
        rebanhos,
        divisoes,
        lotacao: this.formValues(body),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('lotacao/form')
  async editar(@Param('id') id: string) {
    const [lotacao, rebanhos, divisoes] = await Promise.all([
      this.lotacaoService.findOne(id),
      this.lotacaoService.findAllRebanhos(),
      this.lotacaoService.findAllDivisoes(),
    ]);
    return { titulo: 'Editar Lotação', lotacao, rebanhos, divisoes };
  }

  @Post(':id/editar')
  async editarPost(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.lotacaoService.update(id, body);
      res.redirect('/lotacoes');
    } catch (e) {
      const [rebanhos, divisoes] = await Promise.all([
        this.lotacaoService.findAllRebanhos(),
        this.lotacaoService.findAllDivisoes(),
      ]);
      res.status(422).render('lotacao/form', {
        titulo: 'Editar Lotação',
        rebanhos,
        divisoes,
        lotacao: { ...this.formValues(body), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('lotacao/delete')
  async excluir(@Param('id') id: string) {
    const lotacao = await this.lotacaoService.findOne(id);
    return { titulo: 'Excluir Lotação', lotacao };
  }

  @Post(':id/excluir')
  async excluirPost(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.lotacaoService.remove(id);
      res.redirect('/lotacoes');
    } catch (e) {
      const lotacoes = await this.lotacaoService.findAll();
      res.status(422).render('lotacao/list', {
        titulo: 'Lotações',
        lotacoes,
        erro: mensagemDeErro(e),
      });
    }
  }

  private formValues(body: any): object {
    return {
      ...body,
      rebanho: { id: body.rebanhoId },
      divisao: { id: body.divisaoId },
    };
  }
}
