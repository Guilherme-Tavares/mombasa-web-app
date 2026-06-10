import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { EstoqueMedicamentoService } from './estoque-medicamento.service';

@Controller('estoques')
export class EstoqueMedicamentoController {
  constructor(private readonly estoqueService: EstoqueMedicamentoService) {}

  @Get()
  @Render('estoque/list')
  async list(): Promise<object> {
    const estoques = await this.estoqueService.findAll();
    return { titulo: 'Estoque de Medicamentos', estoques };
  }

  @Get('criar')
  @Render('estoque/form')
  async criar(): Promise<object> {
    const [propriedades, medicamentos] = await Promise.all([
      this.estoqueService.findAllPropriedades(),
      this.estoqueService.findAllMedicamentos(),
    ]);
    const hoje = new Date().toISOString().split('T')[0];
    return { titulo: 'Nova Entrada de Estoque', propriedades, medicamentos, hoje };
  }

  @Post('criar')
  @Redirect('/estoques')
  async store(@Body() dados: any): Promise<void> {
    await this.estoqueService.create(dados);
  }

  @Get(':id/editar')
  @Render('estoque/form')
  async editar(@Param('id') id: string): Promise<object> {
    const [estoque, propriedades, medicamentos] = await Promise.all([
      this.estoqueService.findOne(id),
      this.estoqueService.findAllPropriedades(),
      this.estoqueService.findAllMedicamentos(),
    ]);
    return { titulo: 'Editar Estoque', estoque, propriedades, medicamentos };
  }

  @Post(':id/editar')
  @Redirect('/estoques')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.estoqueService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('estoque/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const estoque = await this.estoqueService.findOne(id);
    return { titulo: 'Excluir Registro de Estoque', estoque };
  }

  @Post(':id/excluir')
  @Redirect('/estoques')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.estoqueService.remove(id);
  }
}
