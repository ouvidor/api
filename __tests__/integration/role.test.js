import request from 'supertest';
import { decode } from 'jsonwebtoken';

import app from '../../src/App';
import factory from '../factories';
import truncate from '../util/truncate';
import registerUser from '../util/registerUser';
import signInUser from '../util/signInUser';

describe('Role', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
  });

  it('should list all roles', async () => {
    const { token } = signInUser({
      email: 'root@gmail.com',
      password: '123456',
    });

    const response = await request(app)
      .get('/role')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toHaveProperty('banana');
    expect(response.status).toBe(200);
  });
});
