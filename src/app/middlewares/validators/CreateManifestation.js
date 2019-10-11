/**
 * Middleware de validação para criação de Manifestation
 * Docs do yup:
 * https://github.com/jquense/yup
 */
// import * as Yup from 'yup' não foi feita porque o Jest aponta como uma branch
import { object, string, array } from 'yup';

export default async (request, response, next) => {
  try {
    const schema = object().shape({
      title: string().required('Título é necessário'),
      description: string().required('Descrição é necessária'),
      // está incompleto usar array().of(...).min(2).required(...)
      categories: array()
        .min(1)
        .required('Categorias são necessárias'),
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
