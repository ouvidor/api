import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';
import Ombudsman from '../../src/models/Ombudsman';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

let token;
let prefecture;
let ombudsman;

describe('Prefecture', () => {
  beforeAll(async () => {
    await truncate();
    const { prefecture: seedPrefecture } = await seedDatabase();
    prefecture = seedPrefecture;

    const { token: signedToken } = await sign.in(adminMaster);
    token = signedToken;

    ombudsman = await Ombudsman.create({
      location: 'Local',
      telephone: '2212345678',
      email: 'ouv@mail.br',
      site: 'ouv.com.br',
      attendance: 'Horário de atendimento',
    });
  });

  describe('POST', () => {
    it('should create a new prefecture', async () => {
      const response = await request(app)
        .post('/prefecture/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Prefeitura de Arraial do Cabo',
          location: 'location',
          telephone: 'telephone',
          email: 'arraial@prefeitura.com',
          site: 'https://arraial.prefeitura.com.br',
          attendance: 'attendance',
          ombudsmanEmail: ombudsman.email,
        });

      expect(response.body).toHaveProperty(
        'id',
        'name',
        'location',
        'telephone',
        'email',
        'site',
        'attendance'
      );

      expect(response.status).toBe(201);
    });

    it('should fail, duplicated email', async () => {
      const response = await request(app)
        .post('/prefecture/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Prefeitura de Arraial',
          location: 'location',
          telephone: 'telephone',
          email: 'arraial@prefeitura.com',
          site: 'https://arraial.com.br',
          attendance: 'attendance',
          ombudsmanEmail: ombudsman.email,
        });

      expect(response.body).toHaveProperty(
        'message',
        'Esse email já está sendo usado por outra prefeitura.'
      );

      expect(response.status).toBe(409);
    });
  });

  describe('GET', () => {
    it('fetch successful', async () => {
      // listar
      const response = await request(app)
        .get('/prefecture')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            location: expect.any(String),
            name: expect.any(String),
            telephone: expect.any(String),
            email: expect.any(String),
            site: expect.any(String),
            attendance: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            ombudsmen_id: expect.any(Number),
            ombudsman: {
              id: expect.any(Number),
              location: expect.any(String),
              telephone: expect.any(String),
              email: expect.any(String),
              site: expect.any(String),
              attendance: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          }),
        ])
      );
    });

    it('show successful', async () => {
      // listar
      const response = await request(app)
        .get(`/prefecture/${prefecture.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          location: expect.any(String),
          name: expect.any(String),
          telephone: expect.any(String),
          email: expect.any(String),
          site: expect.any(String),
          attendance: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          ombudsmen_id: expect.any(Number),
          ombudsman: {
            id: expect.any(Number),
            location: expect.any(String),
            telephone: expect.any(String),
            email: expect.any(String),
            site: expect.any(String),
            attendance: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        })
      );
    });
  });

  describe('PUT', () => {
    it('update successful', async () => {
      const response = await request(app)
        .put(`/prefecture/${prefecture.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          location: 'location',
          telephone: 'telephone',
          email: 'email',
          site: 'site',
          attendance: 'attendance',
        });

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        location: expect.any(String),
        name: expect.any(String),
        telephone: expect.any(String),
        email: expect.any(String),
        site: expect.any(String),
        attendance: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        ombudsmen_id: expect.any(Number),
      });
      expect(response.status).toBe(200);
    });
  });
});
