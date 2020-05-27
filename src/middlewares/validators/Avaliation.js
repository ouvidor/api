import { object, number, string } from 'yup';

class AvaliationValidator {
  async save(request, response, next) {
    try {
      const schema = object().shape({
        rate: number()
          .min(1, 'A nota mínima é 1')
          .max(5, 'A nota máxima é 5')
          .integer('A nota deve ser um número inteiro')
          .required('A nota é necessária'),
        description: string(),
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

export default new AvaliationValidator();
