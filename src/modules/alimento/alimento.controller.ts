import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { AlimentoService } from './alimento.service';

@Controller('alimentos')
export class AlimentoController {
  constructor(private readonly alimentoService: AlimentoService) {}

  @Get()
  @Render('alimento/list')
  async list(): Promise<object> {
    const alimentos = await this.alimentoService.findAll();
    return { titulo: 'Alimentos', alimentos };
  }

  @Get('criar')
  @Render('alimento/form')
  criar(): object {
    return { titulo: 'Novo Alimento' };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.alimentoService.create(dados);
      res.redirect('/alimentos');
    } catch (e) {
      res.status(422).render('alimento/form', {
        titulo: 'Novo Alimento',
        alimento: dados,
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('alimento/form')
  async editar(@Param('id') id: string): Promise<object> {
    const alimento = await this.alimentoService.findOne(id);
    return { titulo: 'Editar Alimento', alimento };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.alimentoService.update(id, dados);
      res.redirect('/alimentos');
    } catch (e) {
      res.status(422).render('alimento/form', {
        titulo: 'Editar Alimento',
        alimento: { ...dados, id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('alimento/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const alimento = await this.alimentoService.findOne(id);
    return { titulo: 'Excluir Alimento', alimento };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.alimentoService.remove(id);
      res.redirect('/alimentos');
    } catch (e) {
      const alimentos = await this.alimentoService.findAll();
      res.status(422).render('alimento/list', {
        titulo: 'Alimentos',
        alimentos,
        erro: mensagemDeErro(e),
      });
    }
  }
}
