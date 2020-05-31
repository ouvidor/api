/**
 * Classe App, orquestradora da API
 * responsável por iniciar a conexão ao banco de dados, manter as rotas e
 * as middlewares de configuração
 */
import './bootstrap'; // puxa a configuração das variaveis de ambiente
import express from 'express';
import cors from 'cors';
import 'express-async-errors'; // permite o uso do errorHandler
import helmet from 'helmet';

import ErrorHandler from './middlewares/ErrorHandler';
import logger from './middlewares/logger';
// inicia a instancia do Sequelize, fazendo a conexão com o Database
import './database';

// instancia configurada do Sequelize, para conectar ao Database
import routes from './routes';

// jobs, funções que são executadas de tempo em tempo
import jobArchiveManifestations from './jobs/archiveManifestations';

class App {
  constructor() {
    this.server = express();

    this.config();
    this.routes();
    this.jobs();
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
    if (process.env.NODE_ENV !== 'test') {
      this.server.use(logger);
    }
    this.server.use(routes);
    this.server.use(ErrorHandler);
  }

  jobs() {
    jobArchiveManifestations.start();
  }
}

// cria uma instancia do App e inicia o servidor
export default new App().server;
