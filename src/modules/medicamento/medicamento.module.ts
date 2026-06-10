import { Module } from '@nestjs/common';
import { MedicamentoController } from './medicamento.controller';
import { MedicamentoService } from './medicamento.service';

@Module({
  controllers: [MedicamentoController],
  providers: [MedicamentoService],
})
export class MedicamentoModule {}
