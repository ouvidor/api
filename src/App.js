/**
 * Classe App, orquestradora da API
 * responsável por iniciar a conexão ao banco de dados, manter as rotas e
 * as middlewares de configuração
 */
import './bootstrap';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ErrorHandler from './app/middlewares/ErrorHandler';

// inicia a instancia do Sequelize, fazendo a conexão com o Database
import './database';

// instancia configurada do Sequelize, para conectar ao Database
import routes from './routes';

class App {
  constructor() {
    this.server = express();

    this.config();
    this.routes();
  }

  // middlewares de configuração
  config() {
    // permite intenficação de json nas rotas
    this.server.use(express.json());

    // Previne Cross-site scripting, remove o X-Powered-By e muitas outras coisas
    this.server.use(helmet());

    // CORS permite acesso de qualquer ip à API
    this.server.use(cors());

    // nessecario para que ao receber uma requisição com JSON, consiga ler ele como objeto sem problemas
    this.server.use(express.urlencoded({ extended: true }));
  }

  // conecta as rotas ao app
  routes() {
    this.server.use(routes);
    // Error handler padrão do Express
    this.server.use(ErrorHandler.expressErrorHandler);

    // Todas exceções não tratadas caem aqui
    // process.on('uncaughtException', ErrorHandler.genericErrorHandler);
  }
}

// cria uma instancia do App e inicia o servidor
export default new App().server;
