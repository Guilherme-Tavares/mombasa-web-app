import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { CochoService } from './cocho.service';

@Controller('cochos')
export class CochoController {
  constructor(private readonly cochoService: CochoService) {}

  @Get()
  @Render('cocho/list')
  async list(): Promise<object> {
    const cochos = await this.cochoService.findAll();
    return { titulo: 'Cochos', cochos };
  }

  @Get('criar')
  @Render('cocho/form')
  async criar(): Promise<object> {
    const divisoes = await this.cochoService.findAllDivisoes();
    return { titulo: 'Novo Cocho', divisoes };
  }

  @Post('criar')
  async store(@Body() dados: any, @Res() res: Response): Promise<void> {
    try {
      await this.cochoService.create(dados);
      res.redirect('/cochos');
    } catch (e) {
      const divisoes = await this.cochoService.findAllDivisoes();
      res.status(422).render('cocho/form', {
        titulo: 'Novo Cocho',
        divisoes,
        cocho: this.formValues(dados),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('cocho/form')
  async editar(@Param('id') id: string): Promise<object> {
    const [cocho, divisoes] = await Promise.all([
      this.cochoService.findOne(id),
      this.cochoService.findAllDivisoes(),
    ]);
    return { titulo: 'Editar Cocho', cocho, divisoes };
  }

  @Post(':id/editar')
  async update(
    @Param('id') id: string,
    @Body() dados: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.cochoService.update(id, dados);
      res.redirect('/cochos');
    } catch (e) {
      const divisoes = await this.cochoService.findAllDivisoes();
      res.status(422).render('cocho/form', {
        titulo: 'Editar Cocho',
        divisoes,
        cocho: { ...this.formValues(dados), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('cocho/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const cocho = await this.cochoService.findOne(id);
    return { titulo: 'Excluir Cocho', cocho };
  }

  @Post(':id/excluir')
  async destroy(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.cochoService.remove(id);
      res.redirect('/cochos');
    } catch (e) {
      const cochos = await this.cochoService.findAll();
      res.status(422).render('cocho/list', {
        titulo: 'Cochos',
        cochos,
        erro: mensagemDeErro(e),
      });
    }
  }

  private formValues(dados: any): object {
    return {
      ...dados,
      divisao: { id: dados.divisaoId },
      ativo: dados.ativo === '1',
    };
  }
}
