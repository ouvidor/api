import AppError from '../errors/AppError';

async function errorHandler(error, request, response, next) {
  if (error instanceof AppError) {
    return response
      .status(error.statusCode)
      .json({ status: 'error', message: error.message });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(error.message);
  }

  return response
    .status(500)
    .json({ status: 'error', message: 'Unexpected error.' });
}

export default errorHandler;
