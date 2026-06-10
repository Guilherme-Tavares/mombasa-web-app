import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { RebanhoService } from './rebanho.service';

@Controller('rebanhos')
export class RebanhoController {
  constructor(private readonly rebanhoService: RebanhoService) {}

  @Get()
  @Render('rebanho/list')
  async list(): Promise<object> {
    const rebanhos = await this.rebanhoService.findAll();
    return { titulo: 'Rebanhos', rebanhos };
  }

  @Get('criar')
  @Render('rebanho/form')
  async criar(): Promise<object> {
    const propriedades = await this.rebanhoService.findAllPropriedades();
    return { titulo: 'Novo Rebanho', propriedades };
  }

  @Post('criar')
  @Redirect('/rebanhos')
  async store(@Body() dados: any): Promise<void> {
    await this.rebanhoService.create(dados);
  }

  @Get(':id/editar')
  @Render('rebanho/form')
  async editar(@Param('id') id: string): Promise<object> {
    const [rebanho, propriedades] = await Promise.all([
      this.rebanhoService.findOne(id),
      this.rebanhoService.findAllPropriedades(),
    ]);
    return { titulo: 'Editar Rebanho', rebanho, propriedades };
  }

  @Post(':id/editar')
  @Redirect('/rebanhos')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.rebanhoService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('rebanho/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const rebanho = await this.rebanhoService.findOne(id);
    return { titulo: 'Excluir Rebanho', rebanho };
  }

  @Post(':id/excluir')
  @Redirect('/rebanhos')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.rebanhoService.remove(id);
  }
}
