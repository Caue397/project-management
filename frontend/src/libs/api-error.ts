import { isAxiosError } from 'axios';

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 400:
        return 'Dados inválidos. Verifique as informações e tente novamente.';
      case 401:
        return 'Sessão expirada. Faça login novamente.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Já existe um registro com essas informações.';
      default:
        return 'Ocorreu um erro inesperado. Tente novamente.';
    }
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}
