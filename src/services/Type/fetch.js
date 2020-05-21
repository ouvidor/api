import Type from '../../models/Type';

const fetchTypes = async () => {
  const types = await Type.findAll();

  return types;
};

export default fetchTypes;
