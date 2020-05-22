import Prefecture from '../../models/Prefecture';
import Ombudsman from '../../models/Ombudsman';

const fetchPrefectures = async () => {
  const prefectures = await Prefecture.findAll({
    include: [{ model: Ombudsman, as: 'ombudsman' }],
  });

  return prefectures;
};

export default fetchPrefectures;
