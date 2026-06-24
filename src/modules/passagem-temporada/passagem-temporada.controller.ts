import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { PassagemTemporadaService } from './passagem-temporada.service';

@Controller('passagens')
export class PassagemTemporadaController {
  constructor(private readonly passagemService: PassagemTemporadaService) {}

  @Get()
  @Render('passagem/list')
  async listar() {
    const passagens = await this.passagemService.findAll();
    return { titulo: 'Passagens de Temporada', passagens };
  }

  @Get('criar')
  @Render('passagem/form')
  async criar() {
    const [rebanhos, temporadas] = await Promise.all([
      this.passagemService.findAllRebanhos(),
      this.passagemService.findAllTemporadas(),
    ]);
    return { titulo: 'Nova Passagem de Temporada', rebanhos, temporadas };
  }

  @Post('criar')
  async criarPost(@Body() body: any, @Res() res: Response): Promise<void> {
    try {
      await this.passagemService.create(body);
      res.redirect('/passagens');
    } catch (e) {
      const [rebanhos, temporadas] = await Promise.all([
        this.passagemService.findAllRebanhos(),
        this.passagemService.findAllTemporadas(),
      ]);
      res.status(422).render('passagem/form', {
        titulo: 'Nova Passagem de Temporada',
        rebanhos,
        temporadas,
        passagem: this.formValues(body),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('passagem/form')
  async editar(@Param('id') id: string) {
    const [passagem, rebanhos, temporadas] = await Promise.all([
      this.passagemService.findOne(id),
      this.passagemService.findAllRebanhos(),
      this.passagemService.findAllTemporadas(),
    ]);
    return { titulo: 'Editar Passagem de Temporada', passagem, rebanhos, temporadas };
  }

  @Post(':id/editar')
  async editarPost(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.passagemService.update(id, body);
      res.redirect('/passagens');
    } catch (e) {
      const [rebanhos, temporadas] = await Promise.all([
        this.passagemService.findAllRebanhos(),
        this.passagemService.findAllTemporadas(),
      ]);
      res.status(422).render('passagem/form', {
        titulo: 'Editar Passagem de Temporada',
        rebanhos,
        temporadas,
        passagem: { ...this.formValues(body), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('passagem/delete')
  async excluir(@Param('id') id: string) {
    const passagem = await this.passagemService.findOne(id);
    return { titulo: 'Excluir Passagem de Temporada', passagem };
  }

  @Post(':id/excluir')
  async excluirPost(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.passagemService.remove(id);
      res.redirect('/passagens');
    } catch (e) {
      const passagens = await this.passagemService.findAll();
      res.status(422).render('passagem/list', {
        titulo: 'Passagens de Temporada',
        passagens,
        erro: mensagemDeErro(e),
      });
    }
  }

  private formValues(body: any): object {
    return {
      ...body,
      rebanho: { id: body.rebanhoId },
      temporada: { id: body.temporadaId },
    };
  }
}
