import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
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
  @Redirect('/alimentos')
  async store(@Body() dados: any): Promise<void> {
    await this.alimentoService.create(dados);
  }

  @Get(':id/editar')
  @Render('alimento/form')
  async editar(@Param('id') id: string): Promise<object> {
    const alimento = await this.alimentoService.findOne(id);
    return { titulo: 'Editar Alimento', alimento };
  }

  @Post(':id/editar')
  @Redirect('/alimentos')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.alimentoService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('alimento/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const alimento = await this.alimentoService.findOne(id);
    return { titulo: 'Excluir Alimento', alimento };
  }

  @Post(':id/excluir')
  @Redirect('/alimentos')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.alimentoService.remove(id);
  }
}
