import database from '../../database';
import AppError from '../../errors/AppError';
import Manifestation from '../../models/Manifestation';
import ManifestationStatusHistory from '../../models/ManifestationStatusHistory';
import Status from '../../models/Status';

const createManifestationStatusHistory = async ({
  description,
  statusIdentifier,
  manifestationId,
  manifestationAlreadyChecked = false,
}) => {
  let status;

  if (!manifestationAlreadyChecked) {
    const manifestation = await Manifestation.findByPk(manifestationId, {
      attributes: ['id'],
    });

    if (!manifestation) {
      throw new AppError('Essa manifestação não existe.', 404);
    }
  }

  if (typeof statusIdentifier === 'number') {
    status = await Status.findOne({ where: { id: statusIdentifier } });
  } else {
    status = await Status.findOne({ where: { title: statusIdentifier } });
  }

  if (!status) {
    throw new AppError('Esse status não existe.', 404);
  }

  /**
   * Pega o status mais recente da manifestação
   */
  const [latestManifestationStatus] = await database.query(`
    SELECT
      status.title as status_title,
      status.id as status_id,
      msh.manifestations_id
    FROM
      manifestations_status_history msh
    INNER JOIN status ON
      status.id = msh.status_id
    WHERE
      manifestations_id = ${manifestationId}
      AND msh.id IN (
      SELECT
        MAX(id)
      FROM
        manifestations_status_history msh2
      GROUP BY
        manifestations_id )
  `);

  if (latestManifestationStatus) {
    const willStatusBeSame =
      Number(latestManifestationStatus.status_id) === Number(status.id);

    if (willStatusBeSame) {
      throw new AppError('Não pode inserir o mesmo status seguido.', 409);
    }
  }

  const manifestationStatus = await ManifestationStatusHistory.create({
    description,
    manifestations_id: manifestationId,
    status_id: status.id,
  });

  return manifestationStatus;
};

export default createManifestationStatusHistory;
