import { Module } from '@nestjs/common';
import { LotacaoController } from './lotacao.controller';
import { LotacaoService } from './lotacao.service';

@Module({
  controllers: [LotacaoController],
  providers: [LotacaoService],
})
export class LotacaoModule {}
