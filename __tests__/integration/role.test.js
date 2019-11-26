import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import factory from '../factories';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

describe('Role', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
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
      expect.objectContaining({ level: 1, title: 'master' })
    );
    expect(response.body[1]).toEqual(
      expect.objectContaining({ level: 2, title: 'admin' })
    );
    expect(response.body[2]).toEqual(
      expect.objectContaining({ level: 3, title: 'citizen' })
    );
    expect(response.status).toBe(200);
  });

  it('should list a specific role', async () => {
    const {
      body: { token },
    } = await sign.in(adminMaster);

    const { body: role } = await request(app)
      .post('/role')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Role de teste', level: 2 });

    const response = await request(app)
      .get(`/role/${role.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'title', 'level');
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'Role de teste', level: 2 })
    );
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

  it('should create role', async () => {
    const {
      body: { token },
    } = await sign.in(adminMaster);

    const response = await request(app)
      .post('/role')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Role de teste', level: 2 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'title', 'level');
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'Role de teste', level: 2 })
    );
  });

  it("shouldn't duplicated role", async () => {
    const {
      body: { token },
    } = await sign.in(adminMaster);

    await request(app)
      .post('/role')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Role de teste', level: 2 });

    const response = await request(app)
      .post('/role')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Role de teste', level: 2 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toEqual(
      expect.objectContaining({ error: 'Role já cadastrado' })
    );
  });

  it('should update role', async () => {
    const {
      body: { token },
    } = await sign.in(adminMaster);

    const createRoleResponse = await request(app)
      .post('/role')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Role de teste', level: 2 });

    const response = await request(app)
      .put(`/role/${createRoleResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Role atualizada', level: 2 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'title', 'level');
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'Role atualizada', level: 2 })
    );
  });

  it('should update role', async () => {
    const {
      body: { token },
    } = await sign.in(adminMaster);

    const createRoleResponse = await request(app)
      .post('/role')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Role de teste', level: 2 });

    const response = await request(app)
      .delete(`/role/${createRoleResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'title', 'level');
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'Role de teste', level: 2 })
    );
  });
});
