# Ouvidor API

[![CircleCI](https://circleci.com/gh/ouvidor/api.svg?style=svg)](https://circleci.com/gh/ouvidor/api) [![Greenkeeper badge](https://badges.greenkeeper.io/ouvidor/api.svg)](https://greenkeeper.io/)

## Como usar

Primeiro instale todas as dependências com: `yarn install`

Defina suas variáveis de ambiente no arquivo, para isso basta copiar o `.env.example` e fazer um `.env` com seus dados.

Para inicar o servidor só precisa rodar `yarn start` na raiz do projeto.

## Estrutura

O arquivo `src/index.js` inicia o servidor e conecta ao Banco de Dados, após isso passa o controle de rotas para `src/app/routes/routes.index`. Cada route vai ter seu próprio controller e middleware, por exemplo: na classe routes.index daremos:
`app.use('/user', require('./routes/user'));`
dentro dessa rota, encontraremos as sub rotas de get e post, aqui definiremos qual a callback irão executar, usaremos as funções definidas no controller da rota, então ficaria:

```javascript
import UserController from '../controller/user.controller.js';
router.get('/save', UserController.saveToDb);
```

Sendo saveToDb uma função do controller user.controller.

Para exemplo de Middleware, usarei o de autenticação, em routes.index, importaremos o Middleware de autenticação

```javascript
import authMiddleware from '../middlewares/middlewares.auth';
```

após isso diremos no app qual das funções será o middleware, exemplo:

```javascript
app.use(authMiddleware.validateToken);
```

isso faz com que todas requisições de app a partir dessa linha, necessitem de validação de token
