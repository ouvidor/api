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
let prefecture;

describe('Prefecture', () => {
  beforeEach(async () => {
    await truncate();
    const { prefecture: seedPrefecture } = await seedDatabase();
    prefecture = seedPrefecture;
    // necessário login em todos os tests
    const { token: signedToken } = await sign.in(adminMaster);
    token = signedToken;
  });

  describe('GET', () => {
    it('fetch successful', async () => {
      // listar
      const response = await request(app)
        .get('/prefecture')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            location: expect.any(String),
            name: expect.any(String),
            telephone: expect.any(String),
            email: expect.any(String),
            site: expect.any(String),
            attendance: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            ombudsmen_id: expect.any(Number),
            ombudsman: {
              id: expect.any(Number),
              location: expect.any(String),
              telephone: expect.any(String),
              email: expect.any(String),
              site: expect.any(String),
              attendance: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          }),
        ])
      );
    });

    it('show successful', async () => {
      // listar
      const response = await request(app)
        .get(`/prefecture/${prefecture.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          location: expect.any(String),
          name: expect.any(String),
          telephone: expect.any(String),
          email: expect.any(String),
          site: expect.any(String),
          attendance: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          ombudsmen_id: expect.any(Number),
          ombudsman: {
            id: expect.any(Number),
            location: expect.any(String),
            telephone: expect.any(String),
            email: expect.any(String),
            site: expect.any(String),
            attendance: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        })
      );
    });
  });

  describe('PUT', () => {
    it('update successful', async () => {
      const response = await request(app)
        .put(`/prefecture/${prefecture.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          location: 'location',
          telephone: 'telephone',
          email: 'email',
          site: 'site',
          attendance: 'attendance',
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        location: expect.any(String),
        name: expect.any(String),
        telephone: expect.any(String),
        email: expect.any(String),
        site: expect.any(String),
        attendance: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        ombudsmen_id: expect.any(Number),
      });
    });
  });
});
