import database from '../../database';

const generateHeatmap = async ({ init, end, cityName }) => {
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
        m.latitude IS NOT NULL AND m.longitude IS NOT NULL AND DATE(m.created_at) BETWEEN '${init}' AND '${end}'
    ) t
    LEFT JOIN
      prefectures p ON p.ombudsmen_id = t.ombudsmen_id
    WHERE
      p.name = '${cityName}';
  `);

  const formattedResult = result.map(item => ({
    lat: Number(item.lat),
    lng: Number(item.lng),
  }));

  return formattedResult;
};

export default generateHeatmap;
