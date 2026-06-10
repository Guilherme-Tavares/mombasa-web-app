import { Module } from '@nestjs/common';
import { PropriedadeController } from './propriedade.controller';
import { PropriedadeService } from './propriedade.service';

@Module({
  controllers: [PropriedadeController],
  providers: [PropriedadeService],
})
export class PropriedadeModule {}
