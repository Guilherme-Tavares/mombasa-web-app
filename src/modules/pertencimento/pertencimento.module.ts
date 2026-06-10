import { Module } from '@nestjs/common';
import { PertencimentoController } from './pertencimento.controller';
import { PertencimentoService } from './pertencimento.service';

@Module({
  controllers: [PertencimentoController],
  providers: [PertencimentoService],
})
export class PertencimentoModule {}
