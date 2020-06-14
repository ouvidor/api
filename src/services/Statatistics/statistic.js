import database from '../../database';

const generateStatistic = async ({ init, end, cityName }) => {
  /**
   * Autor da query: Lucas Sousa
   */
  const statistic = await database.query(`
    SELECT
      CONCAT(DATE_FORMAT(t.created_at, '%m'), '#', YEAR(t.created_at)) AS mesAno,
      SUM(IF(t.types_id = 1, 1, 0)) AS sugestão,
      SUM(IF(t.types_id = 2, 1, 0)) AS elogio,
      SUM(IF(t.types_id = 3, 1, 0)) AS solicitacao,
      SUM(IF(t.types_id = 4, 1, 0)) AS reclamacao,
      SUM(IF(t.types_id = 5, 1, 0)) AS denuncia
    FROM
      (
      SELECT
        *
      FROM
        manifestations m
      WHERE
        DATE(m.created_at) BETWEEN '${init}' AND '${end}' )t
    LEFT JOIN prefectures p ON
      p.ombudsmen_id = t.ombudsmen_id
    WHERE
      p.name = '${cityName}'
    GROUP BY
      CONCAT(DATE_FORMAT(t.created_at, '%m'), '#', YEAR(t.created_at))
    ORDER BY
      MAX(YEAR(t.created_at)) DESC,
      MAX(MONTH(t.created_at)) DESC
  `);

  return statistic;
};

export default generateStatistic;
