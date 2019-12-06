/**
 * Middleware de validação para email
 */
// import * as Yup from 'yup' não foi feita porque o Jest aponta como uma branch
import { object, string } from 'yup';

export default async (request, response, next) => {
  try {
    const schema = object().shape({
      title: string().required('O título do email é necessário'),
      text: string().required('O corpo do email é necessário'),
      email: string()
        .email('Email inválido')
        .required('Destinatário necessário'),
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
