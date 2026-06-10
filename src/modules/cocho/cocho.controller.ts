import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
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
  @Redirect('/cochos')
  async store(@Body() dados: any): Promise<void> {
    await this.cochoService.create(dados);
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
  @Redirect('/cochos')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.cochoService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('cocho/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const cocho = await this.cochoService.findOne(id);
    return { titulo: 'Excluir Cocho', cocho };
  }

  @Post(':id/excluir')
  @Redirect('/cochos')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.cochoService.remove(id);
  }
}
