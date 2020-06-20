const checkIfManifestionInUpdatePeriod = currentManifestationStatus => {
  switch (currentManifestationStatus.status.title) {
    case 'cadastrada':
    case 'resposta intermediária':
    case 'arquivada':
      return true;

    default:
      return false;
  }
};

export default checkIfManifestionInUpdatePeriod;
