import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { AlimentoModule } from './modules/alimento/alimento.module';
import { MedicamentoModule } from './modules/medicamento/medicamento.module';
import { ProdutorModule } from './modules/produtor/produtor.module';
import { TemporadaModule } from './modules/temporada/temporada.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProdutorModule,
    TemporadaModule,
    MedicamentoModule,
    AlimentoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
