import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

let token;
let secretary;

describe('Secretary', () => {
  beforeAll(async () => {
    await truncate();
    await seedDatabase();
    const { token: signedToken } = await sign.in(adminMaster);
    token = signedToken;
  });

  it('should create secretary', async () => {
    const response = await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
        city: 'Cabo Frio',
      });

    secretary = response.body;

    expect(response.status).toBe(201);
    expect(secretary).toHaveProperty(
      'id',
      'title',
      'email',
      'accountable',
      'city'
    );
  });

  it('should list all secretariats', async () => {
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
    // listar
    const response = await request(app)
      .get(`/secretary/${secretary.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: secretary.id,
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      })
    );
  });

  it('should update a secretary', async () => {
    const response = await request(app)
      .put(`/secretary/${secretary.id}`)
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
    await request(app)
      .post('/secretary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'MONGO_TITLE_IS_BACK',
        email: 'this.email.will.repeat@gmail.com',
        accountable: 'Maria',
        city: 'Cabo Frio',
      });

    // will try to update
    const response = await request(app)
      .put(`/secretary/${secretary.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'this.email.will.repeat@gmail.com', // duplicated email
      });

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toStrictEqual(
      'Uma secretaria já usa esse email.'
    );
    expect(response.status).toBe(409);
  });

  it('should delete a secretary', async () => {
    const response = await request(app)
      .delete(`/secretary/${secretary.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'secretary',
        email: 'secretary@gmail.com',
        accountable: 'José',
      })
    );
    expect(response.status).toBe(200);
  });
});
