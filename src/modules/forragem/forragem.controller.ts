import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { ForragemService } from './forragem.service';

@Controller('forragens')
export class ForragemController {
  constructor(private readonly forragemService: ForragemService) {}

  @Get()
  @Render('forragem/list')
  async list(): Promise<object> {
    const forragens = await this.forragemService.findAll();
    return { titulo: 'Forragens', forragens };
  }

  @Get('criar')
  @Render('forragem/form')
  async criar(): Promise<object> {
    const divisoes = await this.forragemService.findAllDivisoes();
    return { titulo: 'Nova Forragem', divisoes };
  }

  @Post('criar')
  @Redirect('/forragens')
  async store(@Body() dados: any): Promise<void> {
    await this.forragemService.create(dados);
  }

  @Get(':id/editar')
  @Render('forragem/form')
  async editar(@Param('id') id: string): Promise<object> {
    const [forragem, divisoes] = await Promise.all([
      this.forragemService.findOne(id),
      this.forragemService.findAllDivisoes(),
    ]);
    return { titulo: 'Editar Forragem', forragem, divisoes };
  }

  @Post(':id/editar')
  @Redirect('/forragens')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.forragemService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('forragem/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const forragem = await this.forragemService.findOne(id);
    return { titulo: 'Excluir Forragem', forragem };
  }

  @Post(':id/excluir')
  @Redirect('/forragens')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.forragemService.remove(id);
  }
}
