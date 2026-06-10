import { Module } from '@nestjs/common';
import { BovinoController } from './bovino.controller';
import { BovinoService } from './bovino.service';

@Module({
  controllers: [BovinoController],
  providers: [BovinoService],
})
export class BovinoModule {}
