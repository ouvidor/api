/**
 * Classe App, orquestradora da API
 * responsável por iniciar a conexão ao banco de dados, manter as rotas e
 * as middlewares de configuração
 */
import express from 'express';
import cors from 'cors';

// instancia configurada do Sequelize, para conectar ao Database
import db from './database/database';
import routes from './routes';

class App {
  constructor() {
    this.server = express();

    this.initDatabase();
    this.config();
    this.routes();
  }

  // inicia a conexão com o banco
  initDatabase() {
    db.authenticate()
      .then(() => console.log('database connected...'))
      .catch(err => console.log(`error: ${err}`));
  }

  // middlewares de configuração
  config() {
    // permite intenficação de json nas rotas
    this.server.use(express.json());

    // CORS permite acesso de qualquer ip à API
    this.server.use(cors());

    // nessecario para que ao receber uma requisição com JSON, consiga ler ele como objeto sem problemas
    this.server.use(express.urlencoded({ extended: true }));
  }

  // conecta as rotas ao app
  routes() {
    this.server.use(routes);
  }
}

// cria uma instancia do App e inicia o servidor
export default new App().server;
