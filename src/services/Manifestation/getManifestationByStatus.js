import database from '../../database';

const getManifestationByStatus = async ({
  statusTitle,
  page = 1,
  ownerId,
  itemsPerPage = 10,
}) => {
  let statusFilter = '';
  if (statusTitle) {
    statusFilter = `s.title = "${statusTitle}" AND `;
  }

  const [{ count }] = await database.query(`
    SELECT
      COUNT(DISTINCT (m.id)) 'count'
    FROM
      manifestations m
    INNER JOIN manifestations_status_history msh ON
      msh.manifestations_id = m.id
    INNER JOIN status s ON
      s.id = msh.status_id
    WHERE
      ${statusFilter} m.users_id = ${ownerId}
  `);

  const manifestations = await database.query(`
    SELECT
      DISTINCT (m.id),
      m.title,
      m.description,
      m.latitude,
      m.longitude,
      m.protocol,
      m.users_id,
      m.types_id,
      m.created_at,
      m.updated_at,
      m.secretariats_id,
      m.read,
      msh.status_id,
      s.title
    FROM
      manifestations m
    INNER JOIN manifestations_status_history msh ON
      msh.manifestations_id = m.id
    INNER JOIN status s ON
      s.id = msh.status_id
    WHERE
      ${statusFilter}
      m.users_id = ${ownerId}
      AND msh.id IN (
      SELECT
        MAX(id)
      FROM
        manifestations_status_history
      GROUP BY
        manifestations_id )
    LIMIT 20 OFFSET ${(page - 1) * itemsPerPage}
  `);

  return {
    rows: manifestations,
    count,
    current_page: page,
    last_page: Math.ceil(count / itemsPerPage),
  };
};

export default getManifestationByStatus;
