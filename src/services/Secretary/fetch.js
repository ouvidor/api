import Secretary from '../../models/Secretary';

const fetchSecretariats = async () => {
  const secretariats = await Secretary.findAll({
    attributes: { exclude: ['created_at', 'updated_at'] },
  });

  return secretariats;
};

export default fetchSecretariats;
