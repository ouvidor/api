import request from 'supertest';
import { decode } from 'jsonwebtoken';

import app from '../../src/App';
import factory from '../factories';
import truncate from '../util/truncate';
import sign from '../util/sign';

describe('Auth', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to login', async () => {
    const user = await factory.attrs('User');

    await sign.up(user);

    const response = await request(app)
      .post('/auth')
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');

    const decodedToken = decode(response.body.token);

    expect(decodedToken).toHaveProperty('exp', 'iat', 'id', 'role');
    expect(decodedToken.role[0]).toHaveProperty('id', 'title', 'level');

    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty(
      'id',
      'first_name',
      'last_name',
      'email'
    );
  });

  it('should not find user, wrong password', async () => {
    const user = await factory.attrs('User');

    await sign.up({ ...user, email: 'umemail@gmail.com' });

    const response = await request(app)
      .post('/auth')
      .send({ email: 'umemail@gmail.com', password: 'WRONG_PASSWORD' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toStrictEqual('Email ou senha incorretos');
  });

  it('should not pass validation', async () => {
    // requisição vazia
    let response = await request(app)
      .post('/auth')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toStrictEqual('Validação falhou');
    expect(response.body).toHaveProperty('messages');
    expect(response.body.messages).toEqual(
      expect.arrayContaining(['Email é necessário', 'Senha é necessária'])
    );

    // faltando senha
    response = await request(app)
      .post('/auth')
      .send({ email: 'test@invalid.com' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toStrictEqual('Validação falhou');
    expect(response.body).toHaveProperty('messages');
    expect(response.body.messages).toEqual(
      expect.arrayContaining(['Senha é necessária'])
    );
  });
});
