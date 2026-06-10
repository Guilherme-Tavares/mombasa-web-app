import { Module } from '@nestjs/common';
import { AplicacaoMedicamentoController } from './aplicacao-medicamento.controller';
import { AplicacaoMedicamentoService } from './aplicacao-medicamento.service';

@Module({
  controllers: [AplicacaoMedicamentoController],
  providers: [AplicacaoMedicamentoService],
})
export class AplicacaoMedicamentoModule {}
