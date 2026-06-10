import { Module } from '@nestjs/common';
import { ForragemController } from './forragem.controller';
import { ForragemService } from './forragem.service';

@Module({
  controllers: [ForragemController],
  providers: [ForragemService],
})
export class ForragemModule {}
