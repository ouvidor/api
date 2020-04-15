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
let type;
let manifestation;

describe('Manifestation', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    const { category: categorySeed } = await seedDatabase();

    category = categorySeed;

    // necessário login em todos os tests
    const loginRes = await sign.in(adminMaster);
    token = loginRes.body.token;

    // necessário criação de tipo
    const typeRes = await request(app)
      .post('/type')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'type' });
    type = typeRes.body;

    // criar manifestação
    const manifestationResult = await request(app)
      .post('/manifestation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        description: 'description',
        type_id: type.id,
        categories_id: [category.id],
      });
    manifestation = manifestationResult.body;
  });

  describe('GET', () => {
    it('should list all manifestations', async () => {
      // listar
      const response = await request(app)
        .get('/manifestation')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({ count: 1, last_page: 1 })
      );
      expect(response.body.rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'title',
            description: 'description',
          }),
        ])
      );
      expect(response.body.rows[0]).toHaveProperty(
        'id',
        'title',
        'description',
        'type',
        'categories',
        'location',
        'latitude',
        'longitude',
        'read'
      );
    });

    it('should search for manifestations', async () => {
      // listar
      const response = await request(app)
        .get('/manifestation')
        .query({ text: 'title' })
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({ count: 1, last_page: 1 })
      );
      expect(response.body.rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'title',
            description: 'description',
          }),
        ])
      );
      expect(response.body.rows[0]).toHaveProperty(
        'id',
        'title',
        'description',
        'type',
        'categories',
        'location',
        'latitude',
        'longitude',
        'read'
      );
    });

    it('should search for protocol', async () => {
      // listar
      const response = await request(app)
        .get(`/manifestation/${manifestation.protocol}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      // expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'title',
          description: 'description',
          protocol: manifestation.protocol,
        })
      );
    });

    it('should search with options', async () => {
      // listar
      const response = await request(app)
        .get('/manifestation')
        .query({ options: 'Saneamento' })
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({ count: 1, last_page: 1 })
      );
      expect(response.body.rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'title',
            description: 'description',
            categories: expect.arrayContaining([
              expect.objectContaining({
                title: 'Saneamento',
              }),
            ]),
          }),
        ])
      );
    });

    it('should list a specific manifestation', async () => {
      // listar
      const response = await request(app)
        .get(`/manifestation/${manifestation.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'title',
          description: 'description',
        })
      );
    });

    it('should not list a inexistent manifestation', async () => {
      // listar
      const response = await request(app)
        .get(`/manifestation/${manifestation.id + 20}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'essa manifestação não existe'
      );
    });
  });

  describe('PUT', () => {
    it('should update a manifestation', async () => {
      // update
      const response = await request(app)
        .put(`/manifestation/${manifestation.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'updated' });

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'updated',
          description: 'description',
        })
      );
    });
  });
});
