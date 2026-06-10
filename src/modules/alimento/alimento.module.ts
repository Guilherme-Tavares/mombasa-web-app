import { Module } from '@nestjs/common';
import { AlimentoController } from './alimento.controller';
import { AlimentoService } from './alimento.service';

@Module({
  controllers: [AlimentoController],
  providers: [AlimentoService],
})
export class AlimentoModule {}
