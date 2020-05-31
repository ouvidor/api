import request from 'supertest';

import app from '../../src/App';
import factory from '../factories';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

let token;
let user;

describe('Admin', () => {
  beforeAll(async () => {
    await truncate();
    await seedDatabase();

    const { token: signedToken, user: signedUser } = await sign.in({
      ...adminMaster,
      city: 'Cabo Frio',
    });
    token = signedToken;
    user = signedUser;
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
    it('should update and then login', async () => {
      const response = await request(app)
        .patch(`/admins/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ admin: true })
        .send({});

      expect(response.status).toBe(204);
    });
  });
});
