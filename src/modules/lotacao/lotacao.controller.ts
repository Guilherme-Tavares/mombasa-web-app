import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { LotacaoService } from './lotacao.service';

@Controller('lotacoes')
export class LotacaoController {
  constructor(private readonly lotacaoService: LotacaoService) {}

  @Get()
  @Render('lotacao/list')
  async listar() {
    const lotacoes = await this.lotacaoService.findAll();
    return { titulo: 'Lotações', lotacoes };
  }

  @Get('criar')
  @Render('lotacao/form')
  async criar() {
    const [rebanhos, divisoes] = await Promise.all([
      this.lotacaoService.findAllRebanhos(),
      this.lotacaoService.findAllDivisoes(),
    ]);
    const hoje = new Date().toISOString().split('T')[0];
    return { titulo: 'Nova Lotação', rebanhos, divisoes, hoje };
  }

  @Post('criar')
  @Redirect('/lotacoes')
  async criarPost(@Body() body: any) {
    await this.lotacaoService.create(body);
  }

  @Get(':id/editar')
  @Render('lotacao/form')
  async editar(@Param('id') id: string) {
    const [lotacao, rebanhos, divisoes] = await Promise.all([
      this.lotacaoService.findOne(id),
      this.lotacaoService.findAllRebanhos(),
      this.lotacaoService.findAllDivisoes(),
    ]);
    return { titulo: 'Editar Lotação', lotacao, rebanhos, divisoes };
  }

  @Post(':id/editar')
  @Redirect('/lotacoes')
  async editarPost(@Param('id') id: string, @Body() body: any) {
    await this.lotacaoService.update(id, body);
  }

  @Get(':id/excluir')
  @Render('lotacao/delete')
  async excluir(@Param('id') id: string) {
    const lotacao = await this.lotacaoService.findOne(id);
    return { titulo: 'Excluir Lotação', lotacao };
  }

  @Post(':id/excluir')
  @Redirect('/lotacoes')
  async excluirPost(@Param('id') id: string) {
    await this.lotacaoService.remove(id);
  }
}
