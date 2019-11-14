/**
 * Middleware de validação para Manifestation
 * Docs do yup:
 * https://github.com/jquense/yup
 */
import { object, string, array, number } from 'yup';

class ManifestationValidator {
  async save(request, response, next) {
    try {
      const schema = object().shape({
        title: string().required('Título é necessário'),
        description: string().required('Descrição é necessária'),
        categories_id: array()
          .of(number())
          .min(1)
          .required('Categorias são necessárias'),
        type_id: number().required('Tipo é necessário'),
        secretary_id: number(),
        location: string(),
        latitude: string(),
        longitude: string(),
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
        description: string(),
        categories_id: array()
          .of(number())
          .min(1),
        type_id: number(),
        secretary_id: number(),
        location: string(),
        latitude: string(),
        longitude: string(),
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

export default new ManifestationValidator();
