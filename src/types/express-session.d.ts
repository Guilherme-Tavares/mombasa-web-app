import 'express-session';

// Tipa o usuário guardado na sessão (req.session.user).
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      nome: string;
      email: string;
    };
  }
}
