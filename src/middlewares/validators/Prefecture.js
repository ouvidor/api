/**
 * Middleware de validação generico
 */
import { object, string } from 'yup';

class PrefectureValidator {
  async save(request, response, next) {
    try {
      const schema = object().shape({
        name: string().required('O nome da cidade é necessário'),
        location: string().required('O local da prefeitura é necessário'),
        telephone: string().required('O telefone da prefeitura é necessário'),
        email: string().required('O email da prefeitura é necessário'),
        site: string().required('O site da prefeitura é necessário'),
        attendance: string().required(
          'O horario de atendimento da prefeitura é necessário'
        ),
        ombudsmanEmail: string().required('O email da ouvidoria é necessário'),
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
        name: string(),
        location: string(),
        telephone: string(),
        email: string(),
        site: string(),
        attendance: string(),
        ombudsmanEmail: string(),
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

export default new PrefectureValidator();
