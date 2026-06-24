import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { PropriedadeService } from './propriedade.service';

@Controller('propriedades')
export class PropriedadeController {
  constructor(private readonly propriedadeService: PropriedadeService) {}

  @Get()
  @Render('propriedade/list')
  async list(): Promise<object> {
    const propriedades = await this.propriedadeService.findAll();
    return { titulo: 'Propriedades', propriedades };
  }

  @Get('criar')
  @Render('propriedade/form')
  async criar(): Promise<object> {
    const produtores = await this.propriedadeService.findAllProdutores();
    return { titulo: 'Nova Propriedade', produtores };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.propriedadeService.create(dados);
      res.redirect('/propriedades');
    } catch (e) {
      const produtores = await this.propriedadeService.findAllProdutores();
      res.status(422).render('propriedade/form', {
        titulo: 'Nova Propriedade',
        produtores,
        propriedade: this.formValues(dados),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('propriedade/form')
  async editar(@Param('id') id: string): Promise<object> {
    const [propriedade, produtores] = await Promise.all([
      this.propriedadeService.findOne(id),
      this.propriedadeService.findAllProdutores(),
    ]);
    return { titulo: 'Editar Propriedade', propriedade, produtores };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.propriedadeService.update(id, dados);
      res.redirect('/propriedades');
    } catch (e) {
      const produtores = await this.propriedadeService.findAllProdutores();
      res.status(422).render('propriedade/form', {
        titulo: 'Editar Propriedade',
        produtores,
        propriedade: { ...this.formValues(dados), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('propriedade/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const propriedade = await this.propriedadeService.findOne(id);
    return { titulo: 'Excluir Propriedade', propriedade };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.propriedadeService.remove(id);
      res.redirect('/propriedades');
    } catch (e) {
      const propriedades = await this.propriedadeService.findAll();
      res.status(422).render('propriedade/list', {
        titulo: 'Propriedades',
        propriedades,
        erro: mensagemDeErro(e),
      });
    }
  }

  // Reconstrói o objeto no formato esperado pela view (FK aninhada + booleano).
  private formValues(dados: any): object {
    return {
      ...dados,
      produtor: { id: dados.produtorId },
      ativa: dados.ativa === '1',
    };
  }
}
