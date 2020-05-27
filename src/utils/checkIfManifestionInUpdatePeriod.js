const checkIfManifestionInUpdatePeriod = currentManifestationStatus => {
  switch (currentManifestationStatus) {
    case 'cadastrada':
    case 'complementada':
    case 'arquivada':
      return true;

    default:
      return false;
  }
};

export default checkIfManifestionInUpdatePeriod;
