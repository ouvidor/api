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
  beforeAll(async () => {
    await truncate();
    const { category: categorySeed } = await seedDatabase();
    category = categorySeed;

    const { token: signedToken } = await sign.in(adminMaster);
    token = signedToken;
  });

  describe('GET', () => {
    it('should list all categories', async () => {
      // listar
      const response = await request(app)
        .get('/category')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body[0]).toEqual(
        expect.objectContaining({ title: 'Saneamento' })
      );
      expect(response.status).toBe(200);
    });

    it('should list a specific category', async () => {
      // listar type
      const response = await request(app)
        .get(`/category/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({ title: 'Saneamento', id: category.id })
      );
      expect(response.status).toBe(200);
    });
  });

  describe('POST', () => {
    it("shouldn't create a category, duplicated title", async () => {
      // criar
      const response = await request(app)
        .post('/category')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Saneamento' });

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toStrictEqual('Categoria ja existe.');
      expect(response.status).toBe(409);
    });
  });

  describe('PUT', () => {
    it('should update a category', async () => {
      // update
      const response = await request(app)
        .put(`/category/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'updated' });

      expect(response.body).toEqual(
        expect.objectContaining({ title: 'updated' })
      );
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE', () => {
    it('should delete a category', async () => {
      // delete
      const response = await request(app)
        .delete(`/category/${category.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toHaveProperty(
        'id',
        'title',
        'created_at',
        'updated_at'
      );
      expect(response.status).toBe(200);
    });
  });
});
