import Ombudsman from '../../models/Ombudsman';

const fetchOmbudsmen = async () => {
  const ombudsmen = await Ombudsman.findAll();

  return ombudsmen;
};

export default fetchOmbudsmen;
