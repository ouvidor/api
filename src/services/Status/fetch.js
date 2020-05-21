import Status from '../../models/Status';

const fetchStatus = async () => {
  const status = await Status.findAll();

  return status;
};

export default fetchStatus;
