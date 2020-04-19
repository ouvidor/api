import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

describe('Status', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    await seedDatabase();
  });

  it('should list all status', async () => {
    const { token } = await sign.in(adminMaster);

    const response = await request(app)
      .get('/status')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, title: 'arquivada' }),
        expect.objectContaining({ id: 2, title: 'cadastrada' }),
        expect.objectContaining({ id: 3, title: 'prorrogada' }),
        expect.objectContaining({ id: 4, title: 'resposta intermediária' }),
        expect.objectContaining({ id: 5, title: 'complementada' }),
        expect.objectContaining({ id: 6, title: 'encerrada' }),
        expect.objectContaining({
          id: 7,
          title: 'encaminhada para outra ouvidoria',
        }),
        expect.objectContaining({
          id: 8,
          title: 'encaminhada para orgão externo',
        }),
      ])
    );
  });

  it('should list a specific status', async () => {
    const { token } = await sign.in(adminMaster);

    const response = await request(app)
      .get(`/status/2`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'cadastrada', id: 2 })
    );
  });

  it('should not list a inexistent status', async () => {
    const { token } = await sign.in(adminMaster);

    const response = await request(app)
      .get(`/status/120`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'esse status não existe');
  });
});
