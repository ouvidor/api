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

describe('Type', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    await seedDatabase();

    const loginRes = await sign.in(adminMaster);
    token = loginRes.body.token;
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
          expect.objectContaining({ id: 1, title: 'sugestão' }),
          expect.objectContaining({ id: 2, title: 'elogio' }),
          expect.objectContaining({ id: 3, title: 'solicitação' }),
          expect.objectContaining({ id: 4, title: 'reclamação' }),
          expect.objectContaining({ id: 5, title: 'denúncia' }),
        ])
      );
    });
  });

  describe('SHOW', () => {
    it('show type', async () => {
      const response = await request(app)
        .get('/type/1')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({ id: 1, title: 'sugestão' })
      );
    });
  });
});
