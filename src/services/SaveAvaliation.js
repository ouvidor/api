import Manifestation from '../models/Manifestation';

import AppError from '../errors/AppError';

class SaveAvaliation {
  async run({ rate, description, userId, manifestationId }) {
    const manifestation = await Manifestation.findOne({
      where: {
        id: manifestationId,
        users_id: userId,
      },
    });

    if (!manifestation) {
      throw new AppError(
        'Operação não permitida. Talvez essa não seja a sua manifestação!'
      );
    }

    // RESTANTE DA REGRA DE NEGÓCIO

    return { rate, description };
  }
}

export default new SaveAvaliation();
