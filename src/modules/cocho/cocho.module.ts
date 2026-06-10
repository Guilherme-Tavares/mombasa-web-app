import { Module } from '@nestjs/common';
import { CochoController } from './cocho.controller';
import { CochoService } from './cocho.service';

@Module({
  controllers: [CochoController],
  providers: [CochoService],
})
export class CochoModule {}
