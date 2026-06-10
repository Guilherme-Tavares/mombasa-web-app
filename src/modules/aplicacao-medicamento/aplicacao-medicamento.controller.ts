import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { AplicacaoMedicamentoService } from './aplicacao-medicamento.service';

@Controller('aplicacoes')
export class AplicacaoMedicamentoController {
  constructor(private readonly aplicacaoService: AplicacaoMedicamentoService) {}

  @Get()
  @Render('aplicacao/list')
  async listar() {
    const aplicacoes = await this.aplicacaoService.findAll();
    return { titulo: 'Aplicações de Medicamento', aplicacoes };
  }

  @Get('criar')
  @Render('aplicacao/form')
  async criar() {
    const [bovinos, medicamentos] = await Promise.all([
      this.aplicacaoService.findAllBovinos(),
      this.aplicacaoService.findAllMedicamentos(),
    ]);
    const agora = new Date().toLocaleString('sv-SE').replace(' ', 'T').slice(0, 16);
    return { titulo: 'Nova Aplicação', bovinos, medicamentos, agora };
  }

  @Post('criar')
  @Redirect('/aplicacoes')
  async criarPost(@Body() body: any) {
    await this.aplicacaoService.create(body);
  }

  @Get(':id/editar')
  @Render('aplicacao/form')
  async editar(@Param('id') id: string) {
    const [aplicacao, bovinos, medicamentos] = await Promise.all([
      this.aplicacaoService.findOne(id),
      this.aplicacaoService.findAllBovinos(),
      this.aplicacaoService.findAllMedicamentos(),
    ]);
    return { titulo: 'Editar Aplicação', aplicacao, bovinos, medicamentos };
  }

  @Post(':id/editar')
  @Redirect('/aplicacoes')
  async editarPost(@Param('id') id: string, @Body() body: any) {
    await this.aplicacaoService.update(id, body);
  }

  @Get(':id/excluir')
  @Render('aplicacao/delete')
  async excluir(@Param('id') id: string) {
    const aplicacao = await this.aplicacaoService.findOne(id);
    return { titulo: 'Excluir Aplicação', aplicacao };
  }

  @Post(':id/excluir')
  @Redirect('/aplicacoes')
  async excluirPost(@Param('id') id: string) {
    await this.aplicacaoService.remove(id);
  }
}
