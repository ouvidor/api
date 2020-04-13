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
let category;

describe('Category', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    const { category: categorySeed } = await seedDatabase();
    category = categorySeed;

    const loginRes = await sign.in(adminMaster);
    token = loginRes.body.token;
  });

  it("shouldn't create a category, duplicated title", async () => {
    // criar
    const response = await request(app)
      .post('/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Saneamento' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toStrictEqual('categoria ja existe');
  });

  it('should list all categories', async () => {
    // listar
    const response = await request(app)
      .get('/category')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual(
      expect.objectContaining({ title: 'Saneamento' })
    );
  });

  it('should list a specific category', async () => {
    // listar type
    const response = await request(app)
      .get(`/category/${category.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'Saneamento', id: category.id })
    );
  });

  it('should update a category', async () => {
    // update
    const response = await request(app)
      .put(`/category/${category.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'updated' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'updated' })
    );
  });

  it('should delete a category', async () => {
    // delete
    const response = await request(app)
      .delete(`/category/${category.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: 'Saneamento' })
    );
  });
});
