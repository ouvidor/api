import { format } from 'date-fns';

import database from '../../database';

const generateReport = async ({ init, end, city }) => {
  const formattedInitialDate = format(init, 'dd/MM/yyyy');
  const formattedEndDate = format(end, 'dd/MM/yyyy');

  const result = await database.query(`
    SELECT
      t.secretariats_id AS id,
      s.title, s.accountable,
      SUM(IF(t.status_id = 5, 1, 0)) AS encerradas,
      SUM(IF(t.status_id != 5, 1, 0)) AS semResposta
    FROM
    (
      SELECT
          m.secretariats_id, msh.status_id
      FROM manifestations_status_history msh
      LEFT JOIN manifestations m ON m.id = msh.manifestations_id
      WHERE msh.id
      IN (
          SELECT
              MAX(id)
          FROM manifestations_status_history
          GROUP BY manifestations_id
      )
    )t
    LEFT JOIN secretariats s ON s.id = t.secretariats_id
    GROUP BY t.secretariats_id;
  `);

  return result;
};

export default generateReport;
