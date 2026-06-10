import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { PertencimentoService } from './pertencimento.service';

@Controller('pertencimentos')
export class PertencimentoController {
  constructor(private readonly pertencimentoService: PertencimentoService) {}

  @Get()
  @Render('pertencimento/list')
  async listar() {
    const pertencimentos = await this.pertencimentoService.findAll();
    return { titulo: 'Pertencimentos', pertencimentos };
  }

  @Get('criar')
  @Render('pertencimento/form')
  async criar() {
    const [bovinos, rebanhos] = await Promise.all([
      this.pertencimentoService.findAllBovinos(),
      this.pertencimentoService.findAllRebanhos(),
    ]);
    const hoje = new Date().toISOString().split('T')[0];
    return { titulo: 'Novo Pertencimento', bovinos, rebanhos, hoje };
  }

  @Post('criar')
  @Redirect('/pertencimentos')
  async criarPost(@Body() body: any) {
    await this.pertencimentoService.create(body);
  }

  @Get(':id/editar')
  @Render('pertencimento/form')
  async editar(@Param('id') id: string) {
    const [pertencimento, bovinos, rebanhos] = await Promise.all([
      this.pertencimentoService.findOne(id),
      this.pertencimentoService.findAllBovinos(),
      this.pertencimentoService.findAllRebanhos(),
    ]);
    return { titulo: 'Editar Pertencimento', pertencimento, bovinos, rebanhos };
  }

  @Post(':id/editar')
  @Redirect('/pertencimentos')
  async editarPost(@Param('id') id: string, @Body() body: any) {
    await this.pertencimentoService.update(id, body);
  }

  @Get(':id/excluir')
  @Render('pertencimento/delete')
  async excluir(@Param('id') id: string) {
    const pertencimento = await this.pertencimentoService.findOne(id);
    return { titulo: 'Excluir Pertencimento', pertencimento };
  }

  @Post(':id/excluir')
  @Redirect('/pertencimentos')
  async excluirPost(@Param('id') id: string) {
    await this.pertencimentoService.remove(id);
  }
}
