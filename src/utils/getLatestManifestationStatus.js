import { max, isEqual } from 'date-fns';

const getLatestManifestationStatus = manifestation => {
  const maxDate = max(manifestation.status_history.map(sh => sh.created_at));

  const [latestManifestationStatus] = manifestation.status_history.filter(sh =>
    isEqual(sh.created_at, maxDate)
  );

  return latestManifestationStatus;
};

export default getLatestManifestationStatus;
