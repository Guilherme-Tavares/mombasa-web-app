import { Module } from '@nestjs/common';
import { EstoqueMedicamentoController } from './estoque-medicamento.controller';
import { EstoqueMedicamentoService } from './estoque-medicamento.service';

@Module({
  controllers: [EstoqueMedicamentoController],
  providers: [EstoqueMedicamentoService],
})
export class EstoqueMedicamentoModule {}
