import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { ProdutorService } from './produtor.service';

@Controller('produtores')
export class ProdutorController {
  constructor(private readonly produtorService: ProdutorService) {}

  @Get()
  @Render('produtor/list')
  async list(): Promise<object> {
    const produtores = await this.produtorService.findAll();
    return { titulo: 'Produtores', produtores };
  }

  @Get('criar')
  @Render('produtor/form')
  criar(): object {
    return { titulo: 'Novo Produtor' };
  }

  @Post('criar')
  @Redirect('/produtores')
  async store(@Body() dados: any): Promise<void> {
    await this.produtorService.create(dados);
  }

  @Get(':id/editar')
  @Render('produtor/form')
  async editar(@Param('id') id: string): Promise<object> {
    const produtor = await this.produtorService.findOne(id);
    return { titulo: 'Editar Produtor', produtor };
  }

  @Post(':id/editar')
  @Redirect('/produtores')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.produtorService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('produtor/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const produtor = await this.produtorService.findOne(id);
    return { titulo: 'Excluir Produtor', produtor };
  }

  @Post(':id/excluir')
  @Redirect('/produtores')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.produtorService.remove(id);
  }
}
