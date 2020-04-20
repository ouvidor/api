import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';
import Manifestation from '../../src/app/models/Manifestation';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

let token;
let manifestation;

describe('Manifestation Status History', () => {
  beforeEach(async () => {
    await truncate();
    const { category } = await seedDatabase();

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
        type_id: 1,
      });
    manifestation = manifestationBody;
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
              id: 2,
              title: 'cadastrada',
            }),
            manifestation_id: manifestation.id,
          }),
        ])
      );
    });

    it('shows', async () => {
      expect(manifestation.id).toBeTruthy();

      const saveStatusResponse = await request(app)
        .post(`/manifestation/${manifestation.id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send({
          description: 'description',
          status_id: 1,
        });

      expect(saveStatusResponse.body).toHaveProperty('id');

      const getStatusResponse = await request(app)
        .get(`/manifestation/status/${saveStatusResponse.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(getStatusResponse.body).toEqual(
        expect.objectContaining({
          id: saveStatusResponse.body.id,
          description: 'description',
          status: {
            id: 1,
            title: expect.any(String),
          },
          manifestation_id: manifestation.id,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      );
    });
  });
});
