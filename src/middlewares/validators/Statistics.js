import { object, string } from 'yup';

class SecretaryValidator {
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
        error: 'Validação falhou',
        // pega apenas a mensagens do erros
        messages: error.inner.map(err => err.message),
      });
    }
  }
}

export default new SecretaryValidator();
