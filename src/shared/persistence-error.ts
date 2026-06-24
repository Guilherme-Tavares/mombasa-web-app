import { ValidationException } from './validation.exception';

// Traduz um erro de escrita (regra de negócio ou constraint do banco) em uma
// mensagem amigável em português, para reexibir no formulário.
export function mensagemDeErro(error: unknown): string {
  if (error instanceof ValidationException) return error.message;

  const e = error as { code?: string; driverError?: { code?: string } };
  const code = e?.driverError?.code ?? e?.code;

  switch (code) {
    case 'ER_DUP_ENTRY':
      return 'Já existe um registro com esse valor único.';
    case 'ER_CHECK_CONSTRAINT_VIOLATED':
      return 'Algum valor informado viola as regras de validação (verifique datas, quantidades e pesos).';
    case 'ER_NO_REFERENCED_ROW':
    case 'ER_NO_REFERENCED_ROW_2':
      return 'Registro relacionado inexistente. Selecione um valor válido.';
    case 'ER_ROW_IS_REFERENCED':
    case 'ER_ROW_IS_REFERENCED_2':
      return 'Não é possível excluir: existem registros vinculados a este item.';
    case 'ER_BAD_NULL_ERROR':
    case 'ER_NO_DEFAULT_FOR_FIELD':
      return 'Preencha todos os campos obrigatórios.';
    case 'ER_DATA_TOO_LONG':
      return 'Um dos valores excede o tamanho permitido.';
    case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD':
    case 'WARN_DATA_TRUNCATED':
      return 'Valor inválido para um dos campos.';
    default:
      return 'Não foi possível concluir a operação. Verifique os dados e tente novamente.';
  }
}
