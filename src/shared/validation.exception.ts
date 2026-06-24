// Erro de regra de negócio (ex.: valor único já em uso), com mensagem amigável
// pronta para exibir ao usuário. Lançada pelos services e tratada nos controllers.
export class ValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}
