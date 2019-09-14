/*
    Essa classe é o entry point da aplicação, aqui é iniciado o servidor na instacia
    de app, iniciamos o "listen" do server e passamos o resto das responsabilidades para
    routes.index
*/

import express from 'express';

// instancia configurada do Sequelize, para conectar ao Database
import db from './database/database';

// função com todas as rotas e middlewares da aplicação
import Routes from './app/routes';

const app = express();

// inicia a conexão com o banco
db.authenticate()
  .then(() => console.log('database connected...'))
  .catch(err => console.log(`error: ${err}`));

// Passa a nossa instancia de app para o routes.index ter acesso também.
Routes(app);

const port = process.env.LISTEN_PORT;
app.listen(port, () => {
  console.log(`Listening at port ${port}...`);
});
