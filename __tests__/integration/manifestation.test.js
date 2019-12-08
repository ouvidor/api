import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

let token;
let category;
let type;

describe('Manifestation', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();

    // necessário login em todos os tests
    const loginRes = await sign.in(adminMaster);
    token = loginRes.body.token;

    // necessário criação de categoria
    const categoryRes = await request(app)
      .post('/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'category' });
    category = categoryRes.body;

    // necessário criação de tipo
    const typeRes = await request(app)
      .post('/type')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'type' });
    type = typeRes.body;
  });

  it('should list all manifestations', async () => {
    // criar
    await request(app)
      .post('/manifestation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        description: 'description',
        type_id: type.id,
        categories_id: [category.id],
      });

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
        expect.objectContaining({ title: 'title', description: 'description' }),
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
    // criar
    await request(app)
      .post('/manifestation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        description: 'description',
        type_id: type.id,
        categories_id: [category.id],
      });

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
        expect.objectContaining({ title: 'title', description: 'description' }),
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
    // criar
    const { body: createdManifestation } = await request(app)
      .post('/manifestation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        description: 'description',
        type_id: type.id,
        categories_id: [category.id],
      });

    // listar
    const response = await request(app)
      .get('/manifestation')
      .query({ text: createdManifestation.protocol })
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
          protocol: createdManifestation.protocol,
        }),
      ])
    );
  });

  it('should search with options', async () => {
    // criar
    await request(app)
      .post('/manifestation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        description: 'description',
        type_id: type.id,
        categories_id: [category.id],
      });

    // listar
    const response = await request(app)
      .get('/manifestation')
      .query({ options: 'category' })
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
              title: 'category',
            }),
          ]),
        }),
      ])
    );
  });

  it('should list a specific manifestation', async () => {
    // criar
    const { body: manifestation } = await request(app)
      .post('/manifestation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        description: 'description',
        type_id: type.id,
        categories_id: [category.id],
      });

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

  it('should update a manifestation', async () => {
    // criar
    const { body: manifestation } = await request(app)
      .post('/manifestation')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'title',
        description: 'description',
        type_id: type.id,
        categories_id: [category.id],
      });

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
