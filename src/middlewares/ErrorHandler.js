/**
 * Atenção, o error handler do express apenas trata problemas ocorridos nas rotas ou midlewares.
 */

import AppError from '../errors/AppError';

async function errorHandler(error, request, response, next) {
  if (error instanceof AppError) {
    return response
      .status(error.statusCode)
      .json({ status: 'error', message: error.message });
  }

  return response
    .status(500)
    .json({ status: 'error', message: 'Erro inesperado.' });
}

export default errorHandler;
