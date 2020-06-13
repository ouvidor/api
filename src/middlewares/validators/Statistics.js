import { object, string } from 'yup';

class SecretaryValidator {
  async report(request, response, next) {
    try {
      const schema = object().shape({
        init: string().required('A data de início é necessária'),
        end: string().required('A data de fim é necessária'),
        city: string().required('É necessário informar a cidade'),
      });

      await schema.validate(request.query, { abortEarly: false });
      return next();
    } catch (error) {
      return response.status(400).json({
        error: 'Validação de relatório falhou',
        // pega apenas a mensagens do erros
        messages: error.inner.map(err => err.message),
      });
    }
  }

  async heatmap(request, response, next) {
    try {
      const schema = object().shape({
        init: string().required('A data de início é necessária'),
        end: string().required('A data de fim é necessária'),
        city: string().required('É necessário informar a cidade'),
      });

      await schema.validate(request.query, { abortEarly: false });
      return next();
    } catch (error) {
      return response.status(400).json({
        error: 'Validação de heatmap falhou',
        // pega apenas a mensagens do erros
        messages: error.inner.map(err => err.message),
      });
    }
  }

  async statistic(request, response, next) {
    try {
      const schema = object().shape({
        init: string().required('A data de início é necessária'),
        end: string().required('A data de fim é necessária'),
      });

      await schema.validate(request.query, { abortEarly: false });
      return next();
    } catch (error) {
      return response.status(400).json({
        error: 'Validação de estatística falhou',
        // pega apenas a mensagens do erros
        messages: error.inner.map(err => err.message),
      });
    }
  }
}

export default new SecretaryValidator();
