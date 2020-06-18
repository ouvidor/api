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
      COUNT(DISTINCT(m.id)) 'count'
    FROM manifestations_status_history msh
    INNER JOIN manifestations m ON m.id = msh.manifestations_id
    INNER JOIN status s ON s.id = msh.status_id
    WHERE msh.id IN (
      SELECT MAX(id)
      FROM manifestations_status_history
      GROUP BY manifestations_id
    ) AND ${statusFilter} m.users_id = ${ownerId}
  `);

  const manifestations = await database.query(`
    SELECT
      m.id, m.title, m.description,
      m.latitude, m.longitude,
      m.users_id, m.types_id,
      m.created_at, m.updated_at,
      m.protocol, m.secretariats_id,
      m.read, msh2.status_id,
      s.title AS status_title,
      s.id AS status_id, tp.title as type_title,
      t.categories, t.categories_title,
      a.rate AS avaliation_rate, a.description AS avaliation_description
    FROM (
        SELECT
          MAX(msh.id) AS msh_id,
          MAX(msh.manifestations_id) AS manifestations_id,
          GROUP_CONCAT(c.id) AS categories,
          GROUP_CONCAT(c.title) AS categories_title
        FROM manifestations_status_history msh
        LEFT JOIN manifestations_categories mc ON mc.manifestations_id = msh.manifestations_id
        LEFT JOIN categories c ON c.id = mc.categories_id
        WHERE msh.id IN (
          SELECT
                MAX(id)
          FROM manifestations_status_history
          GROUP BY manifestations_id
        )
        GROUP BY msh.manifestations_id
    ) t
    LEFT JOIN manifestations m ON t.manifestations_id = m.id
    LEFT JOIN types tp ON m.types_id = tp.id
    LEFT JOIN manifestations_status_history msh2 ON t.msh_id = msh2.id
    LEFT JOIN status s ON msh2.status_id = s.id
    LEFT JOIN avaliations a ON t.manifestations_id = a.manifestations_id
    WHERE ${statusFilter} m.users_id = ${ownerId}
    LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};
  `);

  return {
    rows: manifestations,
    count,
    current_page: page,
    last_page: Math.ceil(count / itemsPerPage),
  };
};

export default getManifestationByStatus;
