/**
 * Middleware de validação para registro de usuário
 */
// import * as Yup from 'yup' não foi feita porque o Jest aponta como uma branch
import { object, string } from 'yup';

export default async (request, response, next) => {
  try {
    const schema = object().shape({
      name: string().required('Nome é necessário'),
      email: string()
        .email('Email invalido')
        .required('Email é necessário'),
      password: string()
        .required('Senha é necessária')
        .min(6, 'Senha abaixo de 6 caracteres'),
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
