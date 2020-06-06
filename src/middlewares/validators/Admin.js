/**
 * Middleware de validação generico
 */
import { object, boolean } from 'yup';

class AdminValidator {
  async patch(request, response, next) {
    try {
      const schema = object().shape({
        admin: boolean().required(
          'Necessário informar se deve ou não virar um admin'
        ),
      });

      await schema.validate(request.body, { abortEarly: false });
      return next();
    } catch (error) {
      return response.status(400).json({
        error: 'Validação falhou',
        // pega apenas a mensagens do erros
        messages: error.inner.map(err => err.message),
      });
    }
  }
}

export default new AdminValidator();
