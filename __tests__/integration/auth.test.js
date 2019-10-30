import request from 'supertest';

import app from '../../src/App';
import factory from '../factories';
import truncate from '../util/truncate';
import registerUser from '../util/registerUser';

describe('Auth', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to login', async () => {
    const user = await factory.attrs('User');

    await registerUser(user);

    const response = await request(app)
      .post('/auth')
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
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

    await registerUser({ ...user, email: 'umemail@errado.com' });

    const response = await request(app)
      .post('/auth')
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toStrictEqual('Usuário não encontrado');
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