export default async (err, req, res, next) => {
  console.log(err.code);
  switch (err.code) {
    case 'LIMIT_FILE_SIZE':
      res
        .status(500)
        .json({ message: 'O tamanho maximo de anexos é 8MB', error: err });
      break;
    default:
      res.status(500).json({ message: 'Erro', error: err });
      break;
  }
  next();
};
