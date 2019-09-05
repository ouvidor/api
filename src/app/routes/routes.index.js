/*
    Aqui ocorre a divisão de cada caminho para sua propria rota,
    funciona da seguinte forma:
      app.use('caminhoDaRota', qualRouteVaiCuidarDessaRota);


    TODO: Adicionar middlewares para verificar se está autenticado ou não,
    caso não esteja encaminha-lo para o arquivo de routes de rotas não autenticadas
    e vice e versa.

*/

const express = require('express');

module.exports = function(app) {

  /*
        As rotas funcionam da seguinte forma, esse arquivo (routes.index)é a 
      entrada principal dos requests, abaixo será filtrado e encaminhado para cada 
      caminho especifico, por exemplo, o caminho '/user' terá todas suas rotas no 
      arquivo routes.user.
  */

  //isso abaixo é nessecario para que ao receber um Json do post, consiga ler ele como objeto sem problemas
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());  

  app.use('/user', require('./routes.user'));
};