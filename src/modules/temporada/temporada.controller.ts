import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
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
  @Redirect('/temporadas')
  async store(@Body() dados: any): Promise<void> {
    await this.temporadaService.create(dados);
  }

  @Get(':id/editar')
  @Render('temporada/form')
  async editar(@Param('id') id: string): Promise<object> {
    const temporada = await this.temporadaService.findOne(id);
    return { titulo: 'Editar Temporada', temporada };
  }

  @Post(':id/editar')
  @Redirect('/temporadas')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.temporadaService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('temporada/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const temporada = await this.temporadaService.findOne(id);
    return { titulo: 'Excluir Temporada', temporada };
  }

  @Post(':id/excluir')
  @Redirect('/temporadas')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.temporadaService.remove(id);
  }
}
