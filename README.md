# Ouvidor API

[![CircleCI](https://circleci.com/gh/ouvidor/api.svg?style=svg)](https://circleci.com/gh/ouvidor/api)

## Como usar 🏁

Primeiro instale todas as dependências com: `yarn install`.

Defina suas variáveis de ambiente no arquivo, para isso basta copiar o `.env.example` e fazer um `.env` com seus dados.

> ❗ Para preencher a variável de ambiente `GOOGLE_APPLICATION_CREDENTIALS` é necessário colocar um arquivo JSON na pasta raiz do projeto. Esse arquivo é adquirido fazendo um plano na Google Cloud Storage.

Antes de iniciar é necessário ter conectado seu banco de dados à aplicação e rodado os comandos:
- `yarn migrate`: para rodar todas as migrations.
- `yarn seed`: para preencher o banco com os dados iniciais.

Para inicar a aplicação em modo de desenvolvimento é necessário rodar o comando `yarn dev`.

## Tecnologias utilizadas 🤠

- Node.js
- Express
- Sequelize
- BCrypt.js
- Yup
- Nodemailer
- Multer
- Helmet
- Jest
- Supertest
