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
let manifestation;
let manifestationStatus;

describe('Manifestation Status History', () => {
  beforeEach(async () => {
    await truncate();
    const { category, ombudsman, types, status } = await seedDatabase();

    // necessário login em todos os tests
    const { token: signedToken } = await sign.in(adminMaster);
    token = signedToken;

    const { body: manifestationBody } = await request(app)
      .post('/manifestation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        description: 'description',
        categories_id: [category.id],
        type_id: types[0].id,
        ombudsmen_id: ombudsman.id,
      })
      .expect(201);
    manifestation = manifestationBody;

    const createStatusResponse = await request(app)
      .post(`/manifestation/${manifestation.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'test',
        status_id: status[0].id,
      })
      .expect(201);
    manifestationStatus = createStatusResponse.body;
  });

  describe('GET', () => {
    it('fetchs', async () => {
      const response = await request(app)
        .get(`/manifestation/${manifestation.id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            description: 'A manifestação foi cadastrada',
            created_at: expect.any(String),
            updated_at: expect.any(String),
            status: expect.objectContaining({
              id: expect.any(Number),
              title: 'cadastrada',
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
            status_id: expect.any(Number),
            manifestations_id: manifestation.id,
          }),
        ])
      );
    });

    it('shows', async () => {
      const getStatusResponse = await request(app)
        .get(`/manifestation/status/${manifestationStatus.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(getStatusResponse.body).toEqual(
        expect.objectContaining({
          id: manifestationStatus.id,
          description: 'test',
          status: {
            id: expect.any(Number),
            title: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          manifestations_id: manifestation.id,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      );
    });
  });

  describe('PUT', () => {
    it('updates', async () => {
      const response = await request(app)
        .put(`/manifestation/status/${manifestationStatus.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'updated',
        });

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          description: 'updated',
          created_at: expect.any(String),
          updated_at: expect.any(String),
          manifestations_id: expect.any(Number),
          status_id: expect.any(Number),
          status: {
            id: expect.any(Number),
            title: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        })
      );
      expect(response.status).toBe(200);
    });
  });
});
