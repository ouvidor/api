import { CronJob } from 'cron';

import archiveStaleManifestation from '../services/StatusHistory/archiveStaleManifestations';

const jobArchiveManifestations = new CronJob(
  '0 0 * * *', // 0 0 * * *
  async () => {
    await archiveStaleManifestation();
  },
  null,
  false,
  'America/Sao_Paulo'
);

export default jobArchiveManifestations;
