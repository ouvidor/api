import ManifestationStatusHistory from '../models/ManifestationStatusHistory';
import Status from '../models/Status';

class SetStatusToManifestation {
  async run(manifestation, statusToSave, description) {
    let status;

    if (typeof statusToSave === 'number') {
      status = await Status.findOne({ where: { id: statusToSave } });
    } else {
      status = await Status.findOne({ where: { title: statusToSave } });
    }

    const manifestationStatus = await ManifestationStatusHistory.create({
      description,
      manifestations_id: manifestation.id,
      status_id: status.id,
    });

    return manifestationStatus;
  }
}

export default new SetStatusToManifestation();
