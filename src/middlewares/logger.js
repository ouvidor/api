async function errorHandler(request, response, next) {
  console.info(`METHOD -> ${request.method} | URL -> ${request.url}`);

  return next();
}

export default errorHandler;
