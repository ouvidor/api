import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

describe('Type', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
  });

  it('should list all types', async () => {
    const { body } = await sign.in(adminMaster);

    // criar
    await request(app)
      .post('/type')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'type' });

    // listar
    const response = await request(app)
      .get('/type')
      .set('Authorization', `Bearer ${body.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual(
      expect.objectContaining({ title: 'type' })
    );
  });

  it('should list a specific type', async () => {
    const { body } = await sign.in(adminMaster);

    // criar type
    const {
      body: { id },
    } = await request(app)
      .post('/type')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'type' });

    // listar type
    const response = await request(app)
      .get(`/type/${id}`)
      .set('Authorization', `Bearer ${body.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'type', id })
    );
  });

  it('should create a type', async () => {
    const { body } = await sign.in(adminMaster);

    // criar
    const response = await request(app)
      .post('/type')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'type' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ title: 'type' }));
  });

  it('should update a type', async () => {
    const { body } = await sign.in(adminMaster);

    // criar
    const {
      body: { id },
    } = await request(app)
      .post('/type')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'type' });

    // update
    const response = await request(app)
      .put(`/type/${id}`)
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'updated' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'updated' })
    );
  });

  it('should delete a type', async () => {
    const { body } = await sign.in(adminMaster);

    // criar
    const {
      body: { id },
    } = await request(app)
      .post('/type')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'type' });

    // delete
    const response = await request(app)
      .delete(`/type/${id}`)
      .set('Authorization', `Bearer ${body.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ title: 'type' }));
  });
});
