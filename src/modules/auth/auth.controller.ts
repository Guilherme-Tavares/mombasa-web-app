import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('login')
  @Render('auth/login')
  exibirLogin(): object {
    // layout: false → renderiza a tela sem o layout mestre (sidebar/header).
    return { layout: false };
  }

  @Public()
  @Post('login')
  async autenticar(
    @Body() body: { email?: string; senha?: string },
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const produtor = await this.authService.validarCredenciais(
      body.email ?? '',
      body.senha ?? '',
    );

    if (!produtor) {
      res.render('auth/login', {
        layout: false,
        erro: 'E-mail ou senha inválidos.',
        email: body.email ?? '',
      });
      return;
    }

    req.session.user = {
      id: produtor.id,
      nome: produtor.nome,
      email: produtor.email ?? '',
    };
    res.redirect('/');
  }

  @Post('logout')
  sair(@Req() req: Request, @Res() res: Response): void {
    req.session.destroy(() => res.redirect('/login'));
  }
}
