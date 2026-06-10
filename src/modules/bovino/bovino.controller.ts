import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
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
  @Redirect('/bovinos')
  async store(@Body() dados: any): Promise<void> {
    await this.bovinoService.create(dados);
  }

  @Get(':id/editar')
  @Render('bovino/form')
  async editar(@Param('id') id: string): Promise<object> {
    const bovino = await this.bovinoService.findOne(id);
    return { titulo: 'Editar Bovino', bovino };
  }

  @Post(':id/editar')
  @Redirect('/bovinos')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.bovinoService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('bovino/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const bovino = await this.bovinoService.findOne(id);
    return { titulo: 'Excluir Bovino', bovino };
  }

  @Post(':id/excluir')
  @Redirect('/bovinos')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.bovinoService.remove(id);
  }
}
