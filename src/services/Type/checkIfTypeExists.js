import Type from '../../models/Type';

const doesTypeExists = async id => {
  if (!id) {
    return false;
  }

  const type = await Type.findOne({ where: { id } });

  return !!type;
};

export default doesTypeExists;
