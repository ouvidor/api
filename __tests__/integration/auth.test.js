import request from 'supertest';
import { decode } from 'jsonwebtoken';

import app from '../../src/App';
import factory from '../factories';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';

describe('Auth', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeAll(async () => {
    await truncate();
    await seedDatabase();

    const user = await factory.attrs('User');

    await sign.up({ ...user, email: 'test@gmail.com', password: '123456' });
  });

  it('should be able to login', async () => {
    const response = await request(app)
      .post('/auth')
      .send({
        email: 'test@gmail.com',
        password: '123456',
        city: 'Cabo Frio',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');

    const decodedToken = decode(response.body.token);

    expect(decodedToken).toHaveProperty('exp', 'iat', 'id', 'role', 'city');
    expect(decodedToken.role).toEqual('citizen');

    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty(
      'id',
      'first_name',
      'last_name',
      'email'
    );
  });

  it('should not find user, wrong password', async () => {
    const response = await request(app)
      .post('/auth')
      .send({
        email: 'test@gmail.com',
        password: 'WRONG_PASSWORD',
        city: 'Cabo Frio',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toStrictEqual('Email ou senha incorretos.');
  });

  it('should not pass validation', async () => {
    // requisição vazia
    const response = await request(app)
      .post('/auth')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toStrictEqual('Validação falhou');
    expect(response.body).toHaveProperty('messages');
    expect(response.body.messages).toEqual(
      expect.arrayContaining([
        'Email é necessário',
        'Senha é necessária',
        'Cidade é necessária',
      ])
    );
  });
});
