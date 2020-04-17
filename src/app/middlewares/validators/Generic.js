/**
 * Middleware de validação generico
 */
import { object, string, number } from 'yup';

class GenericValidator {
  async save(request, response, next) {
    try {
      const schema = object().shape({
        title: string().required('O titulo é necessário'),
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

  async update(request, response, next) {
    try {
      const schema = object().shape({
        title: string(),
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

export default new GenericValidator();
