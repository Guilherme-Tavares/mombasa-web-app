import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthRedirectFilter } from './auth-redirect.filter';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    // Protege todas as rotas por padrão; libere pontuais com @Public().
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: AuthRedirectFilter },
  ],
})
export class AuthModule {}
