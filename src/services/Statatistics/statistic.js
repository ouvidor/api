import { format } from 'date-fns';

import database from '../../database';

const generateStatistic = async ({ init, end }) => {
  const formattedInitialDate = format(init, 'dd/MM/yyyy');
  const formattedEndDate = format(end, 'dd/MM/yyyy');

  console.log('data inicial formatada: ', formattedInitialDate);
  console.log('data final formatada: ', formattedEndDate);

  /**
   * Autor da query: Lucas Sousa
   */
  const statistic = await database.query(`
    SELECT
      CONCAT(DATE_FORMAT(created_at, '%m'), '#', YEAR(created_at)) AS mesAno,
      MONTH(created_at) AS mes,
      YEAR(created_at) AS ano,
      SUM(IF(types_id = 1, 1, 0)) AS sugestão,
      SUM(IF(types_id = 2, 1, 0)) AS elogio,
      SUM(IF(types_id = 3, 1, 0)) AS solicitacao,
      SUM(IF(types_id = 4, 1, 0)) AS reclamacao,
      SUM(IF(types_id = 5, 1, 0)) AS denuncia
    FROM manifestations m
    WHERE DATE_FORMAT(created_at, '%d/%m/%Y') >= ${formattedInitialDate}
      AND DATE_FORMAT(created_at, '%d/%m/%Y') <= ${formattedEndDate}
    GROUP BY CONCAT(DATE_FORMAT(created_at, '%m'), '#', YEAR(created_at)), ano, mes
    ORDER BY ano DESC, mes DESC;
  `);

  return statistic;
};

export default generateStatistic;
