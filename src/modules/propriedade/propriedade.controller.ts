import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
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
  @Redirect('/propriedades')
  async store(@Body() dados: any): Promise<void> {
    await this.propriedadeService.create(dados);
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
  @Redirect('/propriedades')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.propriedadeService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('propriedade/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const propriedade = await this.propriedadeService.findOne(id);
    return { titulo: 'Excluir Propriedade', propriedade };
  }

  @Post(':id/excluir')
  @Redirect('/propriedades')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.propriedadeService.remove(id);
  }
}
