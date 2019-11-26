import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};
let token;
let type;

describe('Type', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();

    const loginRes = await sign.in(adminMaster);
    token = loginRes.body.token;

    const typeRes = await request(app)
      .post('/type')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'type' });
    type = typeRes.body;
  });

  it("shouldn't create a type, duplicated title", async () => {
    // criar
    const response = await request(app)
      .post('/type')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'type' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toStrictEqual(
      'um tipo com esse título ja existe'
    );
  });

  it('should list all types', async () => {
    // listar
    const response = await request(app)
      .get('/type')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual(
      expect.objectContaining({ title: 'type' })
    );
  });

  it('should list a specific type', async () => {
    // listar type
    const response = await request(app)
      .get(`/type/${type.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'type', id: type.id })
    );
  });

  it('should update a type', async () => {
    // update
    const response = await request(app)
      .put(`/type/${type.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'updated' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'updated' })
    );
  });

  it('should delete a type', async () => {
    // delete
    const response = await request(app)
      .delete(`/type/${type.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ title: 'type' }));
  });
});
