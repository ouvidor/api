/**
 * Middleware de validação para gerar um token de acesso ao sistema
 */
// import * as Yup from 'yup' não foi feita porque o Jest aponta como uma branch
import { object, string } from 'yup';

export default async (request, response, next) => {
  try {
    const schema = object().shape({
      email: string()
        .email('Email invalido')
        .required('Email é necessário'),
      password: string().required('Senha é necessária'),
      city: string().required('Cidade é necessária'),
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
