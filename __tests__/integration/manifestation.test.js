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
let types;
let manifestation;

describe('Manifestation', () => {
  beforeAll(async () => {
    await truncate();
    const { category: categorySeed, types: typesSeed } = await seedDatabase();
    types = typesSeed;
    category = categorySeed;

    // necessário login em todos os tests
    const { token: signedToken } = await sign.in(adminMaster);
    token = signedToken;
  });

  describe('POST', () => {
    it('should create a manifestation', async () => {
      const manifestationResult = await request(app)
        .post('/manifestation')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'title',
          description: 'description',
          type_id: types[0].id,
          categories_id: [category.id],
        })
        .expect(201);

      manifestation = manifestationResult.body;

      expect(manifestation).toHaveProperty('id');
      expect(manifestation).toHaveProperty('title');
      expect(manifestation).toHaveProperty('description');
      expect(manifestation).toHaveProperty('read');
      expect(manifestation).toHaveProperty('protocol');
    });
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
              secretary: null,
              ombudsmen_id: expect.any(Number),
              files: [],
              user: {
                id: expect.any(Number),
                first_name: expect.any(String),
                last_name: expect.any(String),
                email: expect.any(String),
                role: 'master',
              },
              categories: [
                {
                  id: expect.any(Number),
                  title: 'Saneamento',
                },
              ],
              type: {
                id: expect.any(Number),
                title: expect.any(String),
              },
              status_history: [
                {
                  id: expect.any(Number),
                  description: 'A manifestação foi cadastrada',
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  status: {
                    id: expect.any(Number),
                    title: expect.any(String),
                  },
                },
              ],
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
              secretary: null,
              files: [],
              ombudsmen_id: expect.any(Number),
              user: {
                id: expect.any(Number),
                first_name: expect.any(String),
                last_name: expect.any(String),
                email: expect.any(String),
                role: 'master',
              },
              categories: [
                {
                  id: expect.any(Number),
                  title: 'Saneamento',
                },
              ],
              type: {
                id: expect.any(Number),
                title: expect.any(String),
              },
              status_history: [
                {
                  id: expect.any(Number),
                  description: 'A manifestação foi cadastrada',
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  status: {
                    id: expect.any(Number),
                    title: expect.any(String),
                  },
                },
              ],
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
          secretary: null,
          user: {
            id: expect.any(Number),
            first_name: expect.any(String),
            last_name: expect.any(String),
            email: expect.any(String),
            role: 'master',
          },
          ombudsmen_id: expect.any(Number),
          files: [],
          type: {
            id: expect.any(Number),
            title: expect.any(String),
          },
          categories: [
            {
              id: expect.any(Number),
              title: 'Saneamento',
            },
          ],
          status_history: [
            {
              id: expect.any(Number),
              description: 'A manifestação foi cadastrada',
              created_at: expect.any(String),
              updated_at: expect.any(String),
              status: {
                id: expect.any(Number),
                title: expect.any(String),
              },
            },
          ],
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
              secretary: null,
              ombudsmen_id: expect.any(Number),
              user: {
                id: expect.any(Number),
                first_name: expect.any(String),
                last_name: expect.any(String),
                email: expect.any(String),
                role: 'master',
              },
              categories: [
                {
                  id: expect.any(Number),
                  title: 'Saneamento',
                },
              ],
              type: {
                id: expect.any(Number),
                title: expect.any(String),
              },
              status_history: [
                {
                  id: expect.any(Number),
                  description: 'A manifestação foi cadastrada',
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  status: {
                    id: expect.any(Number),
                    title: expect.any(String),
                  },
                },
              ],
            }),
          ]),
        })
      );
    });

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

  describe('PATCH', () => {
    it('should mark manifestation as read', async () => {
      const response = await request(app)
        .patch(`/manifestation/${manifestation.id}/read`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(204);
    });

    it('should not mark manifestation as read, because it was not found', async () => {
      const response = await request(app)
        .patch(`/manifestation/0/read`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Essa manifestação não existe.'
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
