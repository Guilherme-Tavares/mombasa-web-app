import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { ProdutorService } from './produtor.service';

@Controller('produtores')
export class ProdutorController {
  constructor(private readonly produtorService: ProdutorService) {}

  @Get()
  @Render('produtor/list')
  async list(): Promise<object> {
    const produtores = await this.produtorService.findAll();
    return { titulo: 'Produtores', produtores };
  }

  @Get('criar')
  @Render('produtor/form')
  criar(): object {
    return { titulo: 'Novo Produtor' };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.produtorService.create(dados);
      res.redirect('/produtores');
    } catch (e) {
      res.status(422).render('produtor/form', {
        titulo: 'Novo Produtor',
        produtor: dados,
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('produtor/form')
  async editar(@Param('id') id: string): Promise<object> {
    const produtor = await this.produtorService.findOne(id);
    return { titulo: 'Editar Produtor', produtor };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.produtorService.update(id, dados);
      res.redirect('/produtores');
    } catch (e) {
      res.status(422).render('produtor/form', {
        titulo: 'Editar Produtor',
        produtor: { ...dados, id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('produtor/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const produtor = await this.produtorService.findOne(id);
    return { titulo: 'Excluir Produtor', produtor };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.produtorService.remove(id);
      res.redirect('/produtores');
    } catch (e) {
      const produtores = await this.produtorService.findAll();
      res.status(422).render('produtor/list', {
        titulo: 'Produtores',
        produtores,
        erro: mensagemDeErro(e),
      });
    }
  }
}
