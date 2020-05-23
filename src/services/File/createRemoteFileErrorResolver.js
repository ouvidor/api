import AppError from '../../errors/AppError';

const createRemoteFileErrorResolver = localFile => async error => {
  if (error.code === 404) {
    await localFile.destroy();
    throw new AppError(
      'Apenas a referência ao arquivo existe. Removendo a referência.',
      404
    );
  }

  throw new AppError('Erro ao buscar o arquivo.', 503);
};

export default createRemoteFileErrorResolver;
