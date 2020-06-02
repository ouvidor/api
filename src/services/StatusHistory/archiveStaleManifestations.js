import Database from '../../database';

import createManifestationStatus from './create';

/**
 * ARQUIVAR MANIFESTAÇÕES QUE NÃO RECEBERAM
 * UM NOVO STATUS NOS ULTIMOS 20 DIAS
 */
const archiveStaleManifestation = async () => {
  /**
   * @author Lucas Sousa
   * @since 2020-06-01
   * @description
   * Retorna o id da manifestação que está abandonada (não recebe nenhum status a 20 dias)
   */
  const staleManifestations = await Database.query(`
    SELECT
    m.id
    FROM manifestations_status_history msh
    LEFT JOIN manifestations m ON m.id = msh.manifestations_id
    WHERE msh.id IN
    (
      SELECT
          MAX(id)
      FROM manifestations_status_history
      GROUP BY manifestations_id
    ) AND msh.updated_at < (NOW() - INTERVAL 20 DAY)
    AND msh.status_id NOT IN (1,5);
  `);

  for (const staleManifestation of staleManifestations) {
    createManifestationStatus({
      description: 'Manifestação foi arquivada.',
      manifestationId: staleManifestation.id,
      statusIdentifier: 'arquivada',
      manifestationAlreadyChecked: true,
    });
  }
};

export default archiveStaleManifestation;
