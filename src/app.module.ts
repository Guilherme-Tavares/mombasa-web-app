import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { AlimentoModule } from './modules/alimento/alimento.module';
import { BovinoModule } from './modules/bovino/bovino.module';
import { CochoModule } from './modules/cocho/cocho.module';
import { DivisaoModule } from './modules/divisao/divisao.module';
import { EstoqueMedicamentoModule } from './modules/estoque-medicamento/estoque-medicamento.module';
import { ForragemModule } from './modules/forragem/forragem.module';
import { MedicamentoModule } from './modules/medicamento/medicamento.module';
import { ProdutorModule } from './modules/produtor/produtor.module';
import { PropriedadeModule } from './modules/propriedade/propriedade.module';
import { RebanhoModule } from './modules/rebanho/rebanho.module';
import { TemporadaModule } from './modules/temporada/temporada.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProdutorModule,
    TemporadaModule,
    MedicamentoModule,
    AlimentoModule,
    PropriedadeModule,
    DivisaoModule,
    RebanhoModule,
    ForragemModule,
    CochoModule,
    BovinoModule,
    EstoqueMedicamentoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
