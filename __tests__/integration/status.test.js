import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

describe('Status', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    await seedDatabase();
  });

  it('should create a status', async () => {
    const { body } = await sign.in(adminMaster);

    // criar
    const response = await request(app)
      .post('/status')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'status' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ title: 'status' }));
  });

  it('should list all status', async () => {
    const { body } = await sign.in(adminMaster);

    // criar
    await request(app)
      .post('/status')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'status' });

    // listar
    const response = await request(app)
      .get('/status')
      .set('Authorization', `Bearer ${body.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual(
      expect.objectContaining({ title: 'status' })
    );
  });

  it('should list a specific status', async () => {
    const { body } = await sign.in(adminMaster);

    // criar
    const {
      body: { id },
    } = await request(app)
      .post('/status')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'status' });

    // listar
    const response = await request(app)
      .get(`/status/${id}`)
      .set('Authorization', `Bearer ${body.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'status', id })
    );
  });

  it('should update a status', async () => {
    const { body } = await sign.in(adminMaster);

    // criar
    const {
      body: { id },
    } = await request(app)
      .post('/status')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'status' });

    // update
    const response = await request(app)
      .put(`/status/${id}`)
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'updated' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'updated' })
    );
  });

  it('should delete a status', async () => {
    const { body } = await sign.in(adminMaster);

    // criar
    const {
      body: { id },
    } = await request(app)
      .post('/status')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ title: 'status' });

    // delete
    const response = await request(app)
      .delete(`/status/${id}`)
      .set('Authorization', `Bearer ${body.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ title: 'status' }));
  });
});
