/**
 * Middleware de validação para Role
 */
import { object, number } from 'yup';

class RoleValidator {
  async show(request, response, next) {
    try {
      // validar PARAMS
      const schema = object().shape({
        id: number()
          .integer('Id da Role deve ser um número inteiro')
          .required('Id da Role é necessário'),
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

export default new RoleValidator();
