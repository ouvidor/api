/*
    Aqui ocorre a divisão de cada caminho para sua propria rota,
    funciona da seguinte forma:
      app.use('caminhoDaRota', qualRouteVaiCuidarDessaRota);


    TODO: Adicionar middlewares para verificar se está autenticado ou não,
    caso não esteja encaminha-lo para o arquivo de routes de rotas não autenticadas
    e vice e versa.

*/
import express from 'express';

import authMiddleware from '../middlewares/middlewares.auth';
import userRoutes from './routes.user';
import authRoutes from './routes.auth';

module.exports = app => {
  /*
        As rotas funcionam da seguinte forma, esse arquivo (routes.index)é a
      entrada principal dos requests, abaixo será filtrado e encaminhado para cada
      caminho especifico, por exemplo, o caminho '/user' terá todas suas rotas no
      arquivo routes.user.
  */

  // isso abaixo é nessecario para que ao receber um Json do post, consiga ler ele como objeto sem problemas
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/user', userRoutes);
  app.use('/authenticate', authRoutes);

  // daqui para baixo todas rotas são autenticadas, ao ser enviado o
  // token no header e a validação ser feita com sucesso, seria inserido o valor
  // user_id em <req> no meio do middleware, req.user_id será usado para
  // saber qual usuário está acessando a rota no momento
  app.use(authMiddleware.validateToken);

  // teste
  app.get('/', (req, res) => {
    // quando enviar o json final use um return para finalizar a rota
    return res.send('autenticado');
  });
};