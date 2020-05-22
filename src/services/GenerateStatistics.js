import { QueryTypes } from 'sequelize';
import { endOfMonth, startOfMonth } from 'date-fns';

import Database from '../database';
import Manifestation from '../models/Manifestation';
import ManifestationStatusHistory from '../models/ManifestationStatusHistory';

class GenerateStatistics {
  /**
   * Recebe uma data em formato de Date e também recebe o nome da cidade.
   */
  async run({ date, city }) {
    /**
     *
     */
    const manifestations = await Database.query(
      `SELECT * FROM manifestations m
      LEFT JOIN manifestations_status_history msh ON msh.manifestations_id = m.id
      LEFT JOIN files f ON f.manifestations_id = m.id WHERE m.id = 1;`,
      {
        type: QueryTypes.SELECT,
      }
    );
    console.log(manifestations[0]);
    return manifestations;
    // const manifestations = await Manifestation.findAll({
    //   where: {
    //     created_at: {
    //       [Op.between]: [startOfMonth(date), endOfMonth(date)],
    //     },
    //   },
    //   include: [
    //     {
    //       model: ManifestationStatusHistory,
    //       as: 'status_history',
    //     },
    //   ],
    // });
    // return manifestations;
  }
}

export default new GenerateStatistics();
