import { CronJob } from 'cron';

import Manifestation from '../models/Manifestation';
import ManifestationStatusHistory from '../models/ManifestationStatusHistory';
import Status from '../models/Status';

import getLatestManifestationStatus from '../utils/getLatestManifestationStatus';

const jobArchiveManifestations = new CronJob(
  '* * * * *', // 0 0 * * *
  async () => {
    /**
     * DEVERIA ARQUIVAR MANIFESTAÇÕES QUE NÃO RECEBERAM
     * UM NOVO STATUS A 20 DIAS
     */
  },
  null,
  false,
  'America/Sao_Paulo'
);

export default jobArchiveManifestations;
