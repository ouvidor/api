/**
 * Middleware de validação generico
 */
import { object, string } from 'yup';

class OmbudsmanValidator {
  async save(request, response, next) {
    try {
      const schema = object().shape({
        location: string().required('O local da ouvidoria é necessário'),
        telephone: string().required('O telefone da ouvidoria é necessário'),
        email: string().required('O email da ouvidoria é necessário'),
        site: string().required('O site da ouvidoria é necessário'),
        attendance: string().required(
          'O horario de atendimento da ouvidoria é necessário'
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

  async update(request, response, next) {
    try {
      const schema = object().shape({
        location: string(),
        telephone: string(),
        email: string(),
        site: string(),
        attendance: string(),
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

export default new OmbudsmanValidator();
