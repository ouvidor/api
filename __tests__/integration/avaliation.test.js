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
let arrayOfStatus;
let manifestation;

describe('Avaliation', () => {
  beforeAll(async () => {
    await truncate();
    const { types, category, status } = await seedDatabase();
    arrayOfStatus = status;

    const { token: signedToken } = await sign.in(adminMaster);
    token = signedToken;

    const manifestationResult = await request(app)
      .post('/manifestation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test',
        description: 'test',
        categories_id: [category.id],
        type_id: types[0].id,
      });

    manifestation = manifestationResult.body;
  });

  describe('POST', () => {
    it("shouldn't create avaliation, manifestation is not closed", async () => {
      const response = await request(app)
        .post(`/manifestation/${manifestation.id}/avaliation`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rate: 5 });

      expect(response.body).toHaveProperty(
        'message',
        'A manifestação só pode ser avaliada se estiver encerrada.'
      );
      expect(response.status).toBe(400);
    });

    it('should create avaliation', async () => {
      // colocando status 'encerrada'
      const responseNewStatus = await request(app)
        .post(`/manifestation/${manifestation.id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Fechando', status_id: arrayOfStatus[5].id });

      expect(responseNewStatus.body).toHaveProperty(
        'id',
        'description',
        'status_id',
        'manifestations_id',
        'created_at'
      );

      const response = await request(app)
        .post(`/manifestation/${manifestation.id}/avaliation`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rate: 5 });

      expect(response.body).toHaveProperty(
        'id',
        'reopen',
        'rate',
        'manifestations_id',
        'created_at'
      );
      expect(response.status).toBe(201);
    });

    it('should fail to create avaliation, already avaliated', async () => {
      const response = await request(app)
        .post(`/manifestation/${manifestation.id}/avaliation`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rate: 4 });

      expect(response.body).toHaveProperty(
        'message',
        'A manifestação já foi avaliada e devidamente fechada.'
      );
      expect(response.status).toBe(400);
    });
  });
});
