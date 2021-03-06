/**
 * Middleware de validação para Manifestation
 * Docs do yup:
 * https://github.com/jquense/yup
 */
import { object, string, array, number, boolean, mixed } from 'yup';

class ManifestationValidator {
  async fetch(request, response, next) {
    try {
      const schema = object().shape({
        text: string(),
        // pode ser tanto array como uma string normal
        options: mixed().when('isArray', {
          is: Array.isArray,
          then: array().of(string()),
          otherwise: string(),
        }),
        page: number('page deve ser um número').positive(
          'page não pode ser igual ou abaixo de 0'
        ),
        isRead: number('isRead deve ser um número').oneOf(
          [0, 1],
          'isRead deve ser 0 ou 1'
        ),
        ownerId: number('ownerId deve ser um id do usuário'),
        cancelled: boolean('cancelled deve ser uma boolean'),
        status: string(),
      });

      await schema.validate(request.query, { abortEarly: false });
      return next();
    } catch (error) {
      return response.status(400).json({
        error: 'Validação da query falhou',
        // pega apenas a mensagens do erros
        messages: error.inner.map(err => err.message),
      });
    }
  }

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

  async filter(request, response, next) {
    try {
      const schema = object().shape({
        status: string(),
        page: number().min(1),
        quantity: number().min(1),
      });

      await schema.validate(request.query, { abortEarly: false });
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
