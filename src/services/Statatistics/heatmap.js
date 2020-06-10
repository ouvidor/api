import { format } from 'date-fns';
import database from '../../database';

const generateHeatmap = async ({ init, end, city }) => {
  const formattedInitialDate = format(init, 'dd/MM/yyyy');
  const formattedEndDate = format(end, 'dd/MM/yyyy');

  /**
   * Autor da query: Lucas Sousa
   */
  const result = await database.query(`
    SELECT
      t.latitude as 'lat',
      t.longitude as 'lng'
    FROM
    (
      SELECT
        *
      FROM
        manifestations m
      WHERE
        m.latitude IS NOT NULL AND m.longitude IS NOT NULL AND DATE_FORMAT(m.created_at, '%d/%m/%Y') >= '${formattedInitialDate}' AND DATE_FORMAT(m.created_at, '%d/%m/%Y') <= '${formattedEndDate}'
    ) t
    LEFT JOIN
      prefectures p ON p.ombudsmen_id = t.ombudsmen_id
    WHERE
      p.name = '${city}';
  `);

  return result;
};

export default generateHeatmap;
