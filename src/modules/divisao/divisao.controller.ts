import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { DivisaoService } from './divisao.service';

@Controller('divisoes')
export class DivisaoController {
  constructor(private readonly divisaoService: DivisaoService) {}

  @Get()
  @Render('divisao/list')
  async list(): Promise<object> {
    const divisoes = await this.divisaoService.findAll();
    return { titulo: 'Divisões', divisoes };
  }

  @Get('criar')
  @Render('divisao/form')
  async criar(): Promise<object> {
    const propriedades = await this.divisaoService.findAllPropriedades();
    return { titulo: 'Nova Divisão', propriedades };
  }

  @Post('criar')
  @Redirect('/divisoes')
  async store(@Body() dados: any): Promise<void> {
    await this.divisaoService.create(dados);
  }

  @Get(':id/editar')
  @Render('divisao/form')
  async editar(@Param('id') id: string): Promise<object> {
    const [divisao, propriedades] = await Promise.all([
      this.divisaoService.findOne(id),
      this.divisaoService.findAllPropriedades(),
    ]);
    return { titulo: 'Editar Divisão', divisao, propriedades };
  }

  @Post(':id/editar')
  @Redirect('/divisoes')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.divisaoService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('divisao/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const divisao = await this.divisaoService.findOne(id);
    return { titulo: 'Excluir Divisão', divisao };
  }

  @Post(':id/excluir')
  @Redirect('/divisoes')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.divisaoService.remove(id);
  }
}
