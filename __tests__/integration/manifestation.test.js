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
let manifestation;

describe('Manifestation', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    const { category: categorySeed } = await seedDatabase();

    category = categorySeed;

    // necessário login em todos os tests
    const { token: signedToken } = await sign.in(adminMaster);
    token = signedToken;

    // criar manifestação
    const manifestationResult = await request(app)
      .post('/manifestation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        description: 'description',
        type_id: 1,
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
        .expect(200)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({
          last_page: 1,
          count: 1,
          rows: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              protocol: expect.any(String),
              title: 'title',
              description: 'description',
              read: 0,
              location: null,
              latitude: null,
              longitude: null,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              secretary_id: null,
              user_id: expect.any(Number),
              categories: [
                {
                  id: expect.any(Number),
                  title: 'Saneamento',
                },
              ],
              type: {
                id: 1,
                title: 'sugestão',
              },
            }),
          ]),
        })
      );
    });

    it('should search for manifestations', async () => {
      // listar
      const response = await request(app)
        .get('/manifestation')
        .query({ text: 'title' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({
          last_page: 1,
          count: 1,
          rows: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              protocol: expect.any(String),
              title: 'title',
              description: 'description',
              read: 0,
              location: null,
              latitude: null,
              longitude: null,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              secretary_id: null,
              user_id: expect.any(Number),
              categories: [
                {
                  id: expect.any(Number),
                  title: 'Saneamento',
                },
              ],
              type: {
                id: 1,
                title: 'sugestão',
              },
            }),
          ]),
        })
      );
    });

    it('should search for protocol', async () => {
      // listar
      const response = await request(app)
        .get(`/manifestation/${manifestation.protocol}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          protocol: manifestation.protocol,
          title: 'title',
          description: 'description',
          read: 0,
          location: null,
          latitude: null,
          longitude: null,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          secretary_id: null,
          user_id: expect.any(Number),
          categories: [
            {
              id: expect.any(Number),
              title: 'Saneamento',
            },
          ],
          type: {
            id: 1,
            title: 'sugestão',
          },
        })
      );
    });

    it('should search with options', async () => {
      // listar
      const response = await request(app)
        .get('/manifestation')
        .query({ options: 'Saneamento' })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({
          last_page: 1,
          count: 1,
          rows: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              protocol: expect.any(String),
              title: 'title',
              description: 'description',
              read: 0,
              location: null,
              latitude: null,
              longitude: null,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              secretary_id: null,
              user_id: expect.any(Number),
              categories: [
                {
                  id: expect.any(Number),
                  title: 'Saneamento',
                },
              ],
              type: {
                id: 1,
                title: 'sugestão',
              },
            }),
          ]),
        })
      );
    });

    // it('should list a specific manifestation', async () => {
    //   // listar
    //   const response = await request(app)
    //     .get(`/manifestation/${manifestation.id}`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send();

    //   expect(response.body).toEqual(
    //     expect.objectContaining({
    //       title: 'title',
    //       description: 'description',
    //     })
    //   );
    // });

    it('should not list a inexistent manifestation', async () => {
      // listar
      const response = await request(app)
        .get(`/manifestation/${manifestation.id + 20}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .send();

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
