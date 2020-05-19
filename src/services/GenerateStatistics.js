import { Op } from 'sequelize';
import { endOfMonth, startOfMonth } from 'date-fns';

import Manifestation from '../models/Manifestation';
import ManifestationStatusHistory from '../models/ManifestationStatusHistory';

class GenerateStatistics {
  /**
   * Recebe uma data em formato de Date e também recebe o nome da cidade.
   */
  async run({ date, city }) {
    const manifestations = await Manifestation.findAll({
      where: {
        created_at: {
          [Op.between]: [startOfMonth(date), endOfMonth(date)],
        },
      },
      include: [
        {
          model: ManifestationStatusHistory,
          as: 'status_history',
        },
      ],
    });

    return manifestations;
  }
}

export default new GenerateStatistics();
