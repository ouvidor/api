/**
 * Middleware de validação generico
 */
import { object, string } from 'yup';

class GenericValidator {
  async update(request, response, next) {
    try {
      const schema = object().shape({
        location: string().required('O local é necessário'),
        telephone: string().required('O telefone é necessário'),
        email: string().required('O email é necessário'),
        site: string().required('O site é necessário'),
        attendance: string().required('O horario de atendimento é necessário'),
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
