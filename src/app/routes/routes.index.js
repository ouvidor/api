/*
    Aqui ocorre a divisão de cada caminho para sua propria rota,
    funciona da seguinte forma:
      app.use('caminhoDaRota', qualRouteVaiCuidarDessaRota);


    TODO: Adicionar middlewares para verificar se está autenticado ou não,
    caso não esteja encaminha-lo para o arquivo de routes de rotas não autenticadas
    e vice e versa, exemplo:
        //arquivo com funções para checar se esta autenticado
      const AuthStore = require('../stores/authentication.store'); 
        //checa se esta autenticado, caso esteja vai conseguir chegar em routes.auth,
        caso não o middleware vai redireciona-lo para o devido lugar (tela de login talvez)
      app.use('/user', [AuthStore.authenticate], require('./routes.auth'));

*/
module.exports = function(app) {

  /*
        As rotas funcionam da seguinte forma, esse arquivo (routes.index)é a 
      entrada principal dos requests, abaixo será filtrado e encaminhado para cada 
      caminho especifico, por exemplo, o caminho '/user' tera todas suas rotas no 
      arquivo routes.user.
  */
  app.use('/user', require('./routes.user'));
};