import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { MedicamentoService } from './medicamento.service';

@Controller('medicamentos')
export class MedicamentoController {
  constructor(private readonly medicamentoService: MedicamentoService) {}

  @Get()
  @Render('medicamento/list')
  async list(): Promise<object> {
    const medicamentos = await this.medicamentoService.findAll();
    return { titulo: 'Medicamentos', medicamentos };
  }

  @Get('criar')
  @Render('medicamento/form')
  criar(): object {
    return { titulo: 'Novo Medicamento' };
  }

  @Post('criar')
  @Redirect('/medicamentos')
  async store(@Body() dados: any): Promise<void> {
    await this.medicamentoService.create(dados);
  }

  @Get(':id/editar')
  @Render('medicamento/form')
  async editar(@Param('id') id: string): Promise<object> {
    const medicamento = await this.medicamentoService.findOne(id);
    return { titulo: 'Editar Medicamento', medicamento };
  }

  @Post(':id/editar')
  @Redirect('/medicamentos')
  async update(@Param('id') id: string, @Body() dados: any): Promise<void> {
    await this.medicamentoService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('medicamento/delete')
  async excluir(@Param('id') id: string): Promise<object> {
    const medicamento = await this.medicamentoService.findOne(id);
    return { titulo: 'Excluir Medicamento', medicamento };
  }

  @Post(':id/excluir')
  @Redirect('/medicamentos')
  async destroy(@Param('id') id: string): Promise<void> {
    await this.medicamentoService.remove(id);
  }
}
