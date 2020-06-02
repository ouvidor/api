import { Op } from 'sequelize';
import { subDays } from 'date-fns';

import Manifestation from '../../models/Manifestation';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Status from '../../models/Status';

import createManifestationStatus from './create';

const archiveStaleManifestation = async () => {
  /**
   * ARQUIVAR MANIFESTAÇÕES QUE NÃO RECEBERAM
   * UM NOVO STATUS NOS ULTIMOS 20 DIAS
   */

  const manifestations = await Manifestation.findAll({
    include: [
      {
        model: ManifestationStatusHistory,
        as: 'status_history',
        where: {
          created_at: {
            [Op.lte]: [subDays(new Date(), 20)],
          },
        },
        include: [
          {
            model: Status,
            as: 'status',
          },
        ],
      },
    ],
  });

  manifestations.forEach(manifestation => {
    createManifestationStatus({
      description: 'Manifestação foi arquivada.',
      manifestationId: manifestation.id,
      statusIdentifier: 'arquivada',
      manifestationAlreadyChecked: true,
    });
  });

  console.log(manifestations[0].status_history[0]);
  console.log(manifestations[0].status_history[1]);
};

export default archiveStaleManifestation;
