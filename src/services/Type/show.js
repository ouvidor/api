import AppError from '../../errors/AppError';
import Type from '../../models/Type';

const showType = async id => {
  const type = await Type.findOne({ where: { id } });

  if (!type) {
    throw new AppError('Esse tipo não existe.', 404);
  }

  return type;
};

export default showType;
