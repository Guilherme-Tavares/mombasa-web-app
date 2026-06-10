import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { AbastecimentoCochoService } from './abastecimento-cocho.service';

@Controller('abastecimentos')
export class AbastecimentoCochoController {
  constructor(private readonly abastecimentoService: AbastecimentoCochoService) {}

  @Get()
  @Render('abastecimento/list')
  async listar() {
    const abastecimentos = await this.abastecimentoService.findAll();
    return { titulo: 'Abastecimentos de Cocho', abastecimentos };
  }

  @Get('criar')
  @Render('abastecimento/form')
  async criar() {
    const [cochos, alimentos] = await Promise.all([
      this.abastecimentoService.findAllCochos(),
      this.abastecimentoService.findAllAlimentos(),
    ]);
    const agora = new Date().toLocaleString('sv-SE').replace(' ', 'T').slice(0, 16);
    return { titulo: 'Novo Abastecimento', cochos, alimentos, agora };
  }

  @Post('criar')
  @Redirect('/abastecimentos')
  async criarPost(@Body() body: any) {
    await this.abastecimentoService.create(body);
  }

  @Get(':id/editar')
  @Render('abastecimento/form')
  async editar(@Param('id') id: string) {
    const [abastecimento, cochos, alimentos] = await Promise.all([
      this.abastecimentoService.findOne(id),
      this.abastecimentoService.findAllCochos(),
      this.abastecimentoService.findAllAlimentos(),
    ]);
    return { titulo: 'Editar Abastecimento', abastecimento, cochos, alimentos };
  }

  @Post(':id/editar')
  @Redirect('/abastecimentos')
  async editarPost(@Param('id') id: string, @Body() body: any) {
    await this.abastecimentoService.update(id, body);
  }

  @Get(':id/excluir')
  @Render('abastecimento/delete')
  async excluir(@Param('id') id: string) {
    const abastecimento = await this.abastecimentoService.findOne(id);
    return { titulo: 'Excluir Abastecimento', abastecimento };
  }

  @Post(':id/excluir')
  @Redirect('/abastecimentos')
  async excluirPost(@Param('id') id: string) {
    await this.abastecimentoService.remove(id);
  }
}
