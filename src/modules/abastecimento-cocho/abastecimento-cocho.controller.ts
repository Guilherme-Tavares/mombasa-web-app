import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { mensagemDeErro } from '../../shared/persistence-error';
import { AbastecimentoCochoService } from './abastecimento-cocho.service';

@Controller('abastecimentos')
export class AbastecimentoCochoController {
  constructor(private readonly abastecimentoService: AbastecimentoCochoService) {}

  @Get()
  @Render('abastecimento/list')
  async listar() {
    const abastecimentos = await this.abastecimentoService.findAll();
    return { titulo: 'Abastecimentos de Cocho', abastecimentos };
  }

  @Get('criar')
  @Render('abastecimento/form')
  async criar() {
    const [cochos, alimentos] = await Promise.all([
      this.abastecimentoService.findAllCochos(),
      this.abastecimentoService.findAllAlimentos(),
    ]);
    const agora = new Date().toLocaleString('sv-SE').replace(' ', 'T').slice(0, 16);
    return { titulo: 'Novo Abastecimento', cochos, alimentos, agora };
  }

  @Post('criar')
  async criarPost(@Body() body: any, @Res() res: Response): Promise<void> {
    try {
      await this.abastecimentoService.create(body);
      res.redirect('/abastecimentos');
    } catch (e) {
      const [cochos, alimentos] = await Promise.all([
        this.abastecimentoService.findAllCochos(),
        this.abastecimentoService.findAllAlimentos(),
      ]);
      res.status(422).render('abastecimento/form', {
        titulo: 'Novo Abastecimento',
        cochos,
        alimentos,
        abastecimento: this.formValues(body),
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/editar')
  @Render('abastecimento/form')
  async editar(@Param('id') id: string) {
    const [abastecimento, cochos, alimentos] = await Promise.all([
      this.abastecimentoService.findOne(id),
      this.abastecimentoService.findAllCochos(),
      this.abastecimentoService.findAllAlimentos(),
    ]);
    return { titulo: 'Editar Abastecimento', abastecimento, cochos, alimentos };
  }

  @Post(':id/editar')
  async editarPost(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      await this.abastecimentoService.update(id, body);
      res.redirect('/abastecimentos');
    } catch (e) {
      const [cochos, alimentos] = await Promise.all([
        this.abastecimentoService.findAllCochos(),
        this.abastecimentoService.findAllAlimentos(),
      ]);
      res.status(422).render('abastecimento/form', {
        titulo: 'Editar Abastecimento',
        cochos,
        alimentos,
        abastecimento: { ...this.formValues(body), id },
        erro: mensagemDeErro(e),
      });
    }
  }

  @Get(':id/excluir')
  @Render('abastecimento/delete')
  async excluir(@Param('id') id: string) {
    const abastecimento = await this.abastecimentoService.findOne(id);
    return { titulo: 'Excluir Abastecimento', abastecimento };
  }

  @Post(':id/excluir')
  async excluirPost(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.abastecimentoService.remove(id);
      res.redirect('/abastecimentos');
    } catch (e) {
      const abastecimentos = await this.abastecimentoService.findAll();
      res.status(422).render('abastecimento/list', {
        titulo: 'Abastecimentos de Cocho',
        abastecimentos,
        erro: mensagemDeErro(e),
      });
    }
  }

  private formValues(body: any): object {
    return {
      ...body,
      cocho: { id: body.cochoId },
      alimento: { id: body.alimentoId },
      esgotado: body.esgotado === '1',
    };
  }
}
