import Type from '../../models/Type';

const doesTypeExists = async id => {
  const type = await Type.findOne({ where: { id } });

  return !!type;
};

export default doesTypeExists;
