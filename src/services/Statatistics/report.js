import database from '../../database';

const generateReport = async ({ init, end, cityName }) => {
  /**
   * Autor da query: Lucas Sousa
   */
  const result = await database.query(`
    SELECT
      t.secretariats_id AS id,
      s.title,
      s.accountable,
      SUM(IF(t.status_id IN (5, 3), 1, 0)) AS encerradas,
      SUM(IF(t.status_id NOT IN (5, 3), 1, 0)) AS semResposta
    FROM
      (
      SELECT
        m.secretariats_id, msh.status_id, m.ombudsmen_id
      FROM
        manifestations_status_history msh
      LEFT JOIN manifestations m ON
        m.id = msh.manifestations_id
      WHERE
        DATE(msh.created_at) BETWEEN '${init}' AND '${end}'
        AND msh.id IN (
        SELECT
          MAX(id)
        FROM
          manifestations_status_history
        GROUP BY
          manifestations_id ) )t
    LEFT JOIN secretariats s ON
      s.id = t.secretariats_id
    LEFT JOIN prefectures p ON
      p.ombudsmen_id = t.ombudsmen_id
    WHERE
      p.name = '${cityName}'
    GROUP BY
      t.secretariats_id
  `);

  return result;
};

export default generateReport;
