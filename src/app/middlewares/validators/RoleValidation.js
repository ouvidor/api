/**
 * Middleware de validação para registro de Type
 */
// import * as Yup from 'yup' não foi feita porque o Jest aponta como uma branch
import { object, string, number } from 'yup';

export default async (request, response, next) => {
  try {
    const schema = object().shape({
      title: string().required('O titulo é necessário'),
      level: number()
        .integer('Apenas número inteiro')
        .min(1, 'O menor nível é o 1')
        .max(3, 'O nível máximo é o 3')
        .required('O nível é necessário'),
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
};
