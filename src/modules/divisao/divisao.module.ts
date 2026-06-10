import { Module } from '@nestjs/common';
import { DivisaoController } from './divisao.controller';
import { DivisaoService } from './divisao.service';

@Module({
  controllers: [DivisaoController],
  providers: [DivisaoService],
})
export class DivisaoModule {}
