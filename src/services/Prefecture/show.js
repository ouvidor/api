import AppError from '../../errors/AppError';

import Prefecture from '../../models/Prefecture';
import Ombudsman from '../../models/Ombudsman';

const showPrefecture = async ({ nameToSearch, idToSearch }) => {
  const prefecture = await Prefecture.findOne({
    where: {
      ...(nameToSearch ? { name: nameToSearch } : { id: idToSearch }),
    },
    include: [{ model: Ombudsman, as: 'ombudsman' }],
  });

  if (!prefecture) {
    throw new AppError('Essa prefeitura não existe.', 404);
  }

  return prefecture;
};

export default showPrefecture;
