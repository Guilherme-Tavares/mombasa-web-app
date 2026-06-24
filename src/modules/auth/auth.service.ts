import { Injectable } from '@nestjs/common';
import { Produtor } from '../produtor/produtor.entity';
import { verifyAspNetIdentityHash } from './identity-password.util';

@Injectable()
export class AuthService {
  // Retorna o produtor se as credenciais conferem; caso contrário, null.
  async validarCredenciais(email: string, senha: string): Promise<Produtor | null> {
    if (!email || !senha) return null;

    const produtor = await Produtor.findOne({ where: { email } });
    if (!produtor || !produtor.senha) return null;

    return verifyAspNetIdentityHash(senha, produtor.senha) ? produtor : null;
  }
}
