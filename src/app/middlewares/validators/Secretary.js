/**
 * Middleware de validação para Secretary
 */
import { object, string } from 'yup';

class SecretaryValidator {
  async save(request, response, next) {
    try {
      const schema = object().shape({
        title: string().required('O titulo é necessário'),
        email: string()
          .email('Email inválido')
          .required('O email é necessário'),
        accountable: string().required(
          'É necessário informar o responsável pela secretaria'
        ),
        city: string().required(
          'É necessário o nome da cidade da qual a secretária faz parte'
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
        title: string(),
        email: string().email('Email inválido'),
        accountable: string(),
        city: string(),
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

export default new SecretaryValidator();
