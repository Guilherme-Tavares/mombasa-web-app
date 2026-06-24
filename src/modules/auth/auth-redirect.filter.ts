import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

// Converte a falha de autenticação (UnauthorizedException) em redirecionamento
// para a tela de login, em vez de devolver um 401 JSON.
@Catch(UnauthorizedException)
export class AuthRedirectFilter implements ExceptionFilter {
  catch(_exception: UnauthorizedException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response.redirect('/login');
  }
}
