/**
/**
 * Middleware de validação para User
 * Docs do yup:
 * https://github.com/jquense/yup
 */
import { object, string } from 'yup';

class UserValidator {
  async save(request, response, next) {
    try {
      const schema = object().shape({
        first_name: string().required('Nome é necessário'),
        last_name: string().required('Sobrenome é necessário'),
        email: string()
          .email('Email invalido')
          .required('Email é necessário'),
        password: string()
          .required('Senha é necessária')
          .min(6, 'Senha abaixo de 6 caracteres'),
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
        first_name: string(),
        last_name: string(),
        email: string().email('Email invalido'),
        // senha só é requerida se a oldPassword for mandada
        password: string()
          .min(6, 'Senha abaixo de 6 caracteres')
          .when('oldPassword', (oldPassword, field) =>
            oldPassword ? field.required('A nova senha é necessária') : field
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

export default new UserValidator();
