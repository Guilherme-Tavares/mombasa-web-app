import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { ProdutorModule } from './modules/produtor/produtor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProdutorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
