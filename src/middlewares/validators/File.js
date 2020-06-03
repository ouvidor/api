/**
/**
 * Middleware de validação para FTP
 * Docs do yup:
 * https://github.com/jquense/yup
 */

/**
 * As validações do UPLOAD foram feitas diretamente no controller pois não consegui validar um multipart-form/data com
 * o YUP
 */

import { object, string } from 'yup';

class FileValidator {
  async save(request, response, next) {
    try {
      const schema = object().shape({
        id: string().required('Id da entidade é necessário'),
      });

      await schema.validate(request.params, { abortEarly: false });
      return next();
    } catch (error) {
      // console.log(error);
      return response.status(400).json({
        error: 'Validação falhou',
        // pega apenas a mensagens do erros
        messages: error.inner.map(err => err.message),
      });
    }
  }

  async show(request, response, next) {
    try {
      const schema = object().shape({
        file_id: string().required('ID da Manifestação é necessário'),
      });

      await schema.validate(request.params, { abortEarly: false });
      return next();
    } catch (error) {
      // console.log(error);
      return response.status(400).json({
        error: 'Validação falhou',
        // pega apenas a mensagens do erros
        messages: error.inner.map(err => err.message),
      });
    }
  }
}

export default new FileValidator();
