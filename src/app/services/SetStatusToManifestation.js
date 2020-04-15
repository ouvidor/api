import ManifestationStatusHistory from '../models/ManifestationStatusHistory';
import arrayOfStatus from '../data/status';

class SetStatusToManifestation {
  async run(manifestation, statusToSave, description) {
    let status;

    if (typeof statusToSave === 'number') {
      status = arrayOfStatus.find(s => s.id === statusToSave);
    } else {
      status = arrayOfStatus.find(s => s.title === statusToSave);
    }

    const manifestationStatus = await ManifestationStatusHistory.create({
      description,
      manifestation_id: manifestation.id,
      status_id: status.id,
    });

    return manifestationStatus;
  }
}

export default new SetStatusToManifestation();
