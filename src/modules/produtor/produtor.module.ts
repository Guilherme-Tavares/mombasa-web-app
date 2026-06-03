import { Module } from '@nestjs/common';
import { ProdutorController } from './produtor.controller';
import { ProdutorService } from './produtor.service';

@Module({
  controllers: [ProdutorController],
  providers: [ProdutorService],
})
export class ProdutorModule {}
