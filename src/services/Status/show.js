import AppError from '../../errors/AppError';
import Status from '../../models/Status';

const showStatus = async id => {
  const status = await Status.findOne({ where: { id } });

  if (!status) {
    throw new AppError('Esse status não existe.', 404);
  }

  return status;
};

export default showStatus;
