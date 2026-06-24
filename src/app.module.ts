import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { AbastecimentoCochoModule } from './modules/abastecimento-cocho/abastecimento-cocho.module';
import { AuthModule } from './modules/auth/auth.module';
import { AlimentoModule } from './modules/alimento/alimento.module';
import { AplicacaoMedicamentoModule } from './modules/aplicacao-medicamento/aplicacao-medicamento.module';
import { BovinoModule } from './modules/bovino/bovino.module';
import { CochoModule } from './modules/cocho/cocho.module';
import { DivisaoModule } from './modules/divisao/divisao.module';
import { EstoqueMedicamentoModule } from './modules/estoque-medicamento/estoque-medicamento.module';
import { ForragemModule } from './modules/forragem/forragem.module';
import { LotacaoModule } from './modules/lotacao/lotacao.module';
import { MedicamentoModule } from './modules/medicamento/medicamento.module';
import { PassagemTemporadaModule } from './modules/passagem-temporada/passagem-temporada.module';
import { PertencimentoModule } from './modules/pertencimento/pertencimento.module';
import { ProdutorModule } from './modules/produtor/produtor.module';
import { PropriedadeModule } from './modules/propriedade/propriedade.module';
import { RebanhoModule } from './modules/rebanho/rebanho.module';
import { TemporadaModule } from './modules/temporada/temporada.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
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
    LotacaoModule,
    PertencimentoModule,
    PassagemTemporadaModule,
    AplicacaoMedicamentoModule,
    AbastecimentoCochoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
