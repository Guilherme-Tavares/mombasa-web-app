import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { BovinoService } from './bovino.service';

@Controller('bovinos')
export class BovinoController {
  constructor(private readonly bovinoService: BovinoService) {}

  @Get()
  @Render('bovino/list')
  async list(): Promise<object> {
    const bovinos = await this.bovinoService.findAll();
    return { titulo: 'Bovinos', bovinos };
  }

  @Get('criar')
  @Render('bovino/form')
  criar(): object {
    return { titulo: 'Novo Bovino' };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.bovinoService.create(dados);
      res.redirect('/bovinos');
    } catch (e) {
      res.status(422).render('bovino/form', {
        titulo: 'Novo Bovino',
        bovino: { ...dados, ativo: dados.ativo === '1' },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('bovino/form')
  async editar(@Param('id') id: string): Promise<object> {
    const bovino = await this.bovinoService.findOne(id);
    return { titulo: 'Editar Bovino', bovino };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.bovinoService.update(id, dados);
      res.redirect('/bovinos');
    } catch (e) {
      res.status(422).render('bovino/form', {
        titulo: 'Editar Bovino',
        bovino: { ...dados, ativo: dados.ativo === '1', id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('bovino/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const bovino = await this.bovinoService.findOne(id);
    return { titulo: 'Excluir Bovino', bovino };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.bovinoService.remove(id);
      res.redirect('/bovinos');
    } catch (e) {
      const bovinos = await this.bovinoService.findAll();
      res.status(422).render('bovino/list', {
        titulo: 'Bovinos',
        bovinos,
        erro: mensagemDeErro(e),
      });
    }
  }
}
