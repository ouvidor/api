import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

describe('Secretary', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    await seedDatabase();
  });

  it('should list all secretariats', async () => {
    const { token } = await sign.in(adminMaster);

    // criar
    await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      });

    // listar
    const response = await request(app)
      .get('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      })
    );
  });

  it('should list a specific secretary', async () => {
    const { token } = await sign.in(adminMaster);

    // criar
    const {
      body: { id },
    } = await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      });

    // listar
    const response = await request(app)
      .get(`/secretary/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
        id,
      })
    );
  });

  it('should create a secretary', async () => {
    const { token } = await sign.in(adminMaster);

    // criar
    const response = await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      })
    );
  });

  it('should update a secretary', async () => {
    const { token } = await sign.in(adminMaster);

    // criar
    const {
      body: { id },
    } = await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      });

    // update
    const response = await request(app)
      .put(`/secretary/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'secretary', email: 'secretary@gmail.com' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      })
    );
  });

  it("shouldn't update secretary, because email duplicated", async () => {
    const { token } = await sign.in(adminMaster);

    // criar
    await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'first', email: 'first@gmail.com', accountable: 'José' });

    // criar
    const {
      body: { id },
    } = await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'second',
        email: 'second@gmail.com',
        accountable: 'Maria',
      });

    // update
    const response = await request(app)
      .put(`/secretary/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'second', email: 'first@gmail.com', accountable: 'José' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toStrictEqual(
      'Uma secretaria já usa esse email.'
    );
  });

  it("shouldn't update secretary, because title duplicated", async () => {
    const { token } = await sign.in(adminMaster);

    // criar
    await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'first', email: 'first@gmail.com', accountable: 'José' });

    // criar
    const {
      body: { id },
    } = await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'second',
        email: 'second@gmail.com',
        accountable: 'Maria',
      });

    // update
    const response = await request(app)
      .put(`/secretary/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'first', email: 'second@gmail.com', accountable: 'José' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toStrictEqual(
      'Uma secretaria já existe com esse titulo.'
    );
  });

  it('should delete a secretary', async () => {
    const { token } = await sign.in(adminMaster);

    // criar
    const {
      body: { id },
    } = await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      });

    // delete
    const response = await request(app)
      .delete(`/secretary/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      })
    );
  });
});
