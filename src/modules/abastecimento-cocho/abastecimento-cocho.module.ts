import { Module } from '@nestjs/common';
import { AbastecimentoCochoController } from './abastecimento-cocho.controller';
import { AbastecimentoCochoService } from './abastecimento-cocho.service';

@Module({
  controllers: [AbastecimentoCochoController],
  providers: [AbastecimentoCochoService],
})
export class AbastecimentoCochoModule {}
