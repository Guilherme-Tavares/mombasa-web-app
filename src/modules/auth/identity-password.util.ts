import { pbkdf2Sync, timingSafeEqual } from 'crypto';

/**
 * Verifica uma senha contra um hash gerado pelo PasswordHasher do ASP.NET Core Identity.
 * Suporta os formatos V3 (marcador 0x01, padrão atual) e V2 (marcador 0x00).
 * O banco de seed é compartilhado com a API C#, por isso replicamos o envelope dela
 * em vez de adotar bcrypt/argon2.
 */
export function verifyAspNetIdentityHash(senha: string, hashBase64: string): boolean {
  let buf: Buffer;
  try {
    buf = Buffer.from(hashBase64, 'base64');
  } catch {
    return false;
  }
  if (buf.length === 0) return false;

  switch (buf[0]) {
    case 0x01:
      return verificarV3(senha, buf);
    case 0x00:
      return verificarV2(senha, buf);
    default:
      return false;
  }
}

// V3: [0]=0x01 | [1..4]=PRF | [5..8]=iterações | [9..12]=tam. salt | salt | subkey (big-endian)
function verificarV3(senha: string, buf: Buffer): boolean {
  try {
    const prf = buf.readUInt32BE(1);
    const iteracoes = buf.readUInt32BE(5);
    const tamSalt = buf.readUInt32BE(9);
    if (tamSalt < 1) return false;

    const salt = buf.subarray(13, 13 + tamSalt);
    const esperado = buf.subarray(13 + tamSalt);
    if (salt.length !== tamSalt || esperado.length === 0) return false;

    // PRF: 0 = HMAC-SHA1, 1 = HMAC-SHA256, 2 = HMAC-SHA512
    const algoritmo =
      prf === 0 ? 'sha1' : prf === 1 ? 'sha256' : prf === 2 ? 'sha512' : null;
    if (!algoritmo) return false;

    const calculado = pbkdf2Sync(
      Buffer.from(senha, 'utf8'),
      salt,
      iteracoes,
      esperado.length,
      algoritmo,
    );
    return (
      calculado.length === esperado.length && timingSafeEqual(calculado, esperado)
    );
  } catch {
    return false;
  }
}

// V2: [0]=0x00 | [1..16]=salt (128 bits) | [17..48]=subkey (256 bits) — HMAC-SHA1, 1000 iterações
function verificarV2(senha: string, buf: Buffer): boolean {
  try {
    const salt = buf.subarray(1, 17);
    const esperado = buf.subarray(17, 49);
    if (salt.length !== 16 || esperado.length !== 32) return false;

    const calculado = pbkdf2Sync(Buffer.from(senha, 'utf8'), salt, 1000, 32, 'sha1');
    return timingSafeEqual(calculado, esperado);
  } catch {
    return false;
  }
}
