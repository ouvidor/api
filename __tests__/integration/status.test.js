import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

let status;

describe('Status', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    const { status: seedStatus } = await seedDatabase();
    status = seedStatus;
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
        expect.objectContaining({ id: status[0].id, title: 'arquivada' }),
        expect.objectContaining({ id: status[1].id, title: 'cadastrada' }),
        expect.objectContaining({ id: status[2].id, title: 'prorrogada' }),
        expect.objectContaining({
          id: status[3].id,
          title: 'resposta intermediária',
        }),
        expect.objectContaining({ id: status[4].id, title: 'complementada' }),
        expect.objectContaining({ id: status[5].id, title: 'encerrada' }),
        expect.objectContaining({
          id: status[6].id,
          title: 'encaminhada para outra ouvidoria',
        }),
        expect.objectContaining({
          id: status[7].id,
          title: 'encaminhada para orgão externo',
        }),
      ])
    );
  });

  it('should list a specific status', async () => {
    const { token } = await sign.in(adminMaster);

    const response = await request(app)
      .get(`/status/${status[1].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'cadastrada', id: status[1].id })
    );
  });

  it('should not list a inexistent status', async () => {
    const { token } = await sign.in(adminMaster);

    const response = await request(app)
      .get(`/status/0`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Esse status não existe.');
  });
});
