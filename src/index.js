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

  // iniciando a conexão com o banco
  initDatabase() {
    // inicia a conexão com o banco
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

    // isso abaixo é nessecario para que ao receber um Json do post, consiga ler ele como objeto sem problemas
    this.server.use(express.urlencoded({ extended: true }));
  }

  // conectando as rotas ao app
  routes() {
    this.server.use(routes);
  }

  // inicia o servidor
  init() {
    const port = process.env.LISTEN_PORT;
    this.server.listen(port, () => {
      console.log(`Listening at port ${port}...`);
    });
  }
}

// cria uma instancia do App e inicia o servidor
new App().init();
