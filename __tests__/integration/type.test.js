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
let types;

describe('Type', () => {
  beforeAll(async () => {
    await truncate();
    const { types: seedTypes } = await seedDatabase();

    const { token: signedToken } = await sign.in(adminMaster);
    token = signedToken;

    types = seedTypes;
  });

  describe('FETCH', () => {
    it('fetch types', async () => {
      const response = await request(app)
        .get('/type')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: types[0].id, title: 'sugestão' }),
          expect.objectContaining({ id: types[1].id, title: 'elogio' }),
          expect.objectContaining({ id: types[2].id, title: 'solicitação' }),
          expect.objectContaining({ id: types[3].id, title: 'reclamação' }),
          expect.objectContaining({ id: types[4].id, title: 'denúncia' }),
        ])
      );
    });
  });

  describe('SHOW', () => {
    it('show type', async () => {
      const response = await request(app)
        .get(`/type/${types[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({ id: types[0].id, title: 'sugestão' })
      );
    });
  });
});
