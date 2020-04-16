/**
 * Middleware de validação generico
 */
import { object, number } from 'yup';

class GenericValidator {
  async show(request, response, next) {
    try {
      const schema = object().shape({
        id: number()
          .min(1)
          .max(5)
          .integer('O id deve ser um número inteiro')
          .required('O id é necessário'),
      });

      await schema.validate(request.params, { abortEarly: false });
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

export default new GenericValidator();
