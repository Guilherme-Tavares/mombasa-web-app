import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { ForragemService } from './forragem.service';

@Controller('forragens')
export class ForragemController {
  constructor(private readonly forragemService: ForragemService) {}

  @Get()
  @Render('forragem/list')
  async list(): Promise<object> {
    const forragens = await this.forragemService.findAll();
    return { titulo: 'Forragens', forragens };
  }

  @Get('criar')
  @Render('forragem/form')
  async criar(): Promise<object> {
    const divisoes = await this.forragemService.findAllDivisoes();
    return { titulo: 'Nova Forragem', divisoes };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.forragemService.create(dados);
      res.redirect('/forragens');
    } catch (e) {
      const divisoes = await this.forragemService.findAllDivisoes();
      res.status(422).render('forragem/form', {
        titulo: 'Nova Forragem',
        divisoes,
        forragem: this.formValues(dados),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('forragem/form')
  async editar(@Param('id') id: string): Promise<object> {
    const [forragem, divisoes] = await Promise.all([
      this.forragemService.findOne(id),
      this.forragemService.findAllDivisoes(),
    ]);
    return { titulo: 'Editar Forragem', forragem, divisoes };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.forragemService.update(id, dados);
      res.redirect('/forragens');
    } catch (e) {
      const divisoes = await this.forragemService.findAllDivisoes();
      res.status(422).render('forragem/form', {
        titulo: 'Editar Forragem',
        divisoes,
        forragem: { ...this.formValues(dados), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('forragem/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const forragem = await this.forragemService.findOne(id);
    return { titulo: 'Excluir Forragem', forragem };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.forragemService.remove(id);
      res.redirect('/forragens');
    } catch (e) {
      const forragens = await this.forragemService.findAll();
      res.status(422).render('forragem/list', {
        titulo: 'Forragens',
        forragens,
        erro: mensagemDeErro(e),
      });
    }
  }

  private formValues(dados: any): object {
    return {
      ...dados,
      divisao: { id: dados.divisaoId },
      ativa: dados.ativa === '1',
    };
  }
}
