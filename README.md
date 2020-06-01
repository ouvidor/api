# Ouvidor API

[![CircleCI](https://circleci.com/gh/ouvidor/api.svg?style=svg)](https://circleci.com/gh/ouvidor/api)

## Como usar

Primeiro instale todas as dependências com: `yarn install`

Defina suas variáveis de ambiente no arquivo, para isso basta copiar o `.env.example` e fazer um `.env` com seus dados.

Para inicar o servidor só precisa rodar `yarn dev` na raiz do projeto.

## Estrutura

O arquivo `src/index.js` inicia o servidor e conecta ao Banco de Dados, após isso passa o controle de rotas para `src/routes.js`.

```javascript
import UserController from './controller/user.controller';
router.get('/user', UserController.fetch);
```

Para exemplo de Middleware, usarei o de autenticação, em routes.index, importaremos o Middleware de autenticação

```javascript
import AuthMiddleware from './middlewares/auth';
```

Após isso diremos no app qual das funções será o middleware, exemplo:

```javascript
router.use(AuthMiddleware);
```

Isso faz com que todas requisições de app a partir dessa linha, necessitem de validação de token
