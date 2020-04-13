import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import factory from '../factories';
import seedDatabase from '../util/seedDatabase';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

describe('Role', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    await seedDatabase();
  });

  it('should list all roles', async () => {
    const {
      body: { token },
    } = await sign.in(adminMaster);

    const response = await request(app)
      .get('/role')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body[0]).toEqual(
      expect.objectContaining({ id: 1, title: 'citizen' })
    );
    expect(response.body[1]).toEqual(
      expect.objectContaining({ id: 2, title: 'admin' })
    );
    expect(response.body[2]).toEqual(
      expect.objectContaining({ id: 3, title: 'master' })
    );
    expect(response.status).toBe(200);
  });

  it('should list a specific role', async () => {
    const {
      body: { token },
    } = await sign.in(adminMaster);

    const response = await request(app)
      .get(`/role/1`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('title', 'citizen');
  });

  it("citizens shouldn't list all roles", async () => {
    const citizen = await factory.attrs('User');

    await sign.up(citizen);

    const {
      body: { token },
    } = await sign.in(citizen);

    const response = await request(app)
      .get('/role')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toStrictEqual('Acesso exclusivo para Admins');
  });
});
