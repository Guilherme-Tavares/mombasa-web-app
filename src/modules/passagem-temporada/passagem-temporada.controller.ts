import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { PassagemTemporadaService } from './passagem-temporada.service';

@Controller('passagens')
export class PassagemTemporadaController {
  constructor(private readonly passagemService: PassagemTemporadaService) {}

  @Get()
  @Render('passagem/list')
  async listar() {
    const passagens = await this.passagemService.findAll();
    return { titulo: 'Passagens de Temporada', passagens };
  }

  @Get('criar')
  @Render('passagem/form')
  async criar() {
    const [rebanhos, temporadas] = await Promise.all([
      this.passagemService.findAllRebanhos(),
      this.passagemService.findAllTemporadas(),
    ]);
    return { titulo: 'Nova Passagem de Temporada', rebanhos, temporadas };
  }

  @Post('criar')
  @Redirect('/passagens')
  async criarPost(@Body() body: any) {
    await this.passagemService.create(body);
  }

  @Get(':id/editar')
  @Render('passagem/form')
  async editar(@Param('id') id: string) {
    const [passagem, rebanhos, temporadas] = await Promise.all([
      this.passagemService.findOne(id),
      this.passagemService.findAllRebanhos(),
      this.passagemService.findAllTemporadas(),
    ]);
    return { titulo: 'Editar Passagem de Temporada', passagem, rebanhos, temporadas };
  }

  @Post(':id/editar')
  @Redirect('/passagens')
  async editarPost(@Param('id') id: string, @Body() body: any) {
    await this.passagemService.update(id, body);
  }

  @Get(':id/excluir')
  @Render('passagem/delete')
  async excluir(@Param('id') id: string) {
    const passagem = await this.passagemService.findOne(id);
    return { titulo: 'Excluir Passagem de Temporada', passagem };
  }

  @Post(':id/excluir')
  @Redirect('/passagens')
  async excluirPost(@Param('id') id: string) {
    await this.passagemService.remove(id);
  }
}
