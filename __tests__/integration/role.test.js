import request from 'supertest';
import { decode } from 'jsonwebtoken';

import app from '../../src/App';
import factory from '../factories';
import truncate from '../util/truncate';
import registerUser from '../util/registerUser';

describe('Role', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
  });

  it('should list all roles', async () => {
    const loginResponse = await request(app).post('/auth').send({ email: 'root@gmail.com', password: '123456' });
    expect(loginResponse.status).toBe(200);

    const { token } = loginResponse.body;

    const response = await request(app)
      .get('/role')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body[0]).toEqual(expect.objectContaining({ level: 1, title: 'master' }));
    expect(response.body[1]).toEqual(expect.objectContaining({ level: 2, title: 'admin' }));
    expect(response.body[2]).toEqual(expect.objectContaining({ level: 3, title: 'citizen' }));
    expect(response.status).toBe(200);
  });

  it("citizens shouldn't list all roles", async () => {
    const citizen = {
      first_name: 'user',
      last_name: 'tester',
      email: 'user@gmail.com',
      password: '123456'
    };

    await request(app).post('/user').send(citizen);

    const loginResponse = await request(app).post('/auth').send(citizen);
    expect(loginResponse.status).toBe(200);

    const { token } = loginResponse.body;

    const response = await request(app)
      .get('/role')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toStrictEqual('Acesso exclusivo para Admins');
  });
});