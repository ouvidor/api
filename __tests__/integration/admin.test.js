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

describe('Admin', () => {
  beforeAll(async () => {
    await truncate();
    await seedDatabase();

    const { token: signedToken } = await sign.in({
      ...adminMaster,
      city: 'Cabo Frio',
    });
    token = signedToken;
  });

  describe('GET', () => {
    it('should list all admins', async () => {
      const response = await request(app)
        .get('/admins')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            email: 'root@gmail.com',
            first_name: expect.any(String),
            last_name: expect.any(String),
            role: 'master',
          }),
        ])
      );
      expect(response.status).toBe(200);
    });
  });

  describe('PATCH', () => {
    it('should transform a citizen into an admin', async () => {
      const citizenResponse = await sign.up({
        first_name: 'Dark',
        last_name: 'Sorcerer',
        email: 'd4rk@s0rc3r3r.com',
        password: 'D4rk_s0rc3r3r_1337',
      });

      const citizen = citizenResponse.body;

      const response = await request(app)
        .patch(`/admins/${citizen.id}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ admin: true })
        .send({});

      expect(response.status).toBe(204);
    });
  });
});
