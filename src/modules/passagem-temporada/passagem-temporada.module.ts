import { Module } from '@nestjs/common';
import { PassagemTemporadaController } from './passagem-temporada.controller';
import { PassagemTemporadaService } from './passagem-temporada.service';

@Module({
  controllers: [PassagemTemporadaController],
  providers: [PassagemTemporadaService],
})
export class PassagemTemporadaModule {}
