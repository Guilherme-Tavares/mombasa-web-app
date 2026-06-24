import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { TemporadaService } from './temporada.service';

@Controller('temporadas')
export class TemporadaController {
  constructor(private readonly temporadaService: TemporadaService) {}

  @Get()
  @Render('temporada/list')
  async list(): Promise<object> {
    const temporadas = await this.temporadaService.findAll();
    return { titulo: 'Temporadas', temporadas };
  }

  @Get('criar')
  @Render('temporada/form')
  criar(): object {
    return { titulo: 'Nova Temporada' };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.temporadaService.create(dados);
      res.redirect('/temporadas');
    } catch (e) {
      res.status(422).render('temporada/form', {
        titulo: 'Nova Temporada',
        temporada: dados,
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('temporada/form')
  async editar(@Param('id') id: string): Promise<object> {
    const temporada = await this.temporadaService.findOne(id);
    return { titulo: 'Editar Temporada', temporada };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.temporadaService.update(id, dados);
      res.redirect('/temporadas');
    } catch (e) {
      res.status(422).render('temporada/form', {
        titulo: 'Editar Temporada',
        temporada: { ...dados, id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('temporada/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const temporada = await this.temporadaService.findOne(id);
    return { titulo: 'Excluir Temporada', temporada };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.temporadaService.remove(id);
      res.redirect('/temporadas');
    } catch (e) {
      const temporadas = await this.temporadaService.findAll();
      res.status(422).render('temporada/list', {
        titulo: 'Temporadas',
        temporadas,
        erro: mensagemDeErro(e),
      });
    }
  }
}
