/**
 * Middleware de validação para Manifestation
 * Docs do yup:
 * https://github.com/jquense/yup
 */
import { object, string, number } from 'yup';

class ManifestationStatusHistoryValidator {
  async save(request, response, next) {
    try {
      // validar JSON
      let schema = object().shape({
        description: string().required('Descrição é necessária'),
        status_id: number()
          .min(1)
          .required('Status é necessário'),
        secretary_id: number().min(1),
      });
      await schema.validate(request.body, { abortEarly: false });

      // validar PARAMS
      schema = object().shape({
        manifestationId: number()
          .min(1)
          .required('Id da manifestação deve ser passado'),
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

  async update(request, response, next) {
    try {
      // validar JSON
      let schema = object().shape({
        description: string(),
        status_id: number().min(1),
        secretary_id: number().min(1),
      });
      await schema.validate(request.body, { abortEarly: false });

      // validar PARAMS
      schema = object().shape({
        manifestationId: number()
          .min(1)
          .required('Id da manifestação deve ser passado'),
        id: number().required('Id do status da manifestação é necessário'),
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

export default new ManifestationStatusHistoryValidator();
