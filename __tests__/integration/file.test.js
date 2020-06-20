import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';
import File from '../../src/models/File';
import Manifestation from '../../src/models/Manifestation';
import ManifestationStatusHistory from '../../src/models/ManifestationStatusHistory';

let token;
let manifestation;
let manifestationStatus;
let userProfile;

describe('File', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeAll(async () => {
    try {
      await truncate();
      const { ombudsman, category, types, status } = await seedDatabase();
      const { user, token: signedToken } = await sign.in({
        email: 'root@gmail.com',
        password: '123456',
      });
      token = signedToken;
      userProfile = user;

      manifestation = await Manifestation.create({
        title: 'title',
        description: 'description',
        users_id: user.id,
        types_id: types[0].id,
        ombudsmen_id: ombudsman.id,
      });
      manifestation.setCategories(category.id);

      manifestationStatus = await ManifestationStatusHistory.create({
        description: 'Manifestação foi cadastrada.',
        manifestations_id: manifestation.id,
        status_id: status[1].id,
      });

      await File.create({
        name: 'sample.txt',
        name_in_server: 'sample-123456789.txt',
        extension: '.txt',
        manifestations_id: manifestation.id,
        users_id: user.id,
      });

      await File.create({
        name: 'sample.txt',
        name_in_server: 'sample-123456789.txt',
        extension: '.txt',
        manifestations_status_id: manifestationStatus.id,
        users_id: user.id,
      });
    } catch (error) {
      console.info(error);
    }
  });

  describe('FETCH', () => {
    it('fetch manifestation files successful', async () => {
      const response = await request(app)
        .get(`/files/manifestation/${manifestation.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: 'sample.txt',
            name_in_server: 'sample-123456789.txt',
            extension: '.txt',
            created_at: expect.any(String),
            updated_at: expect.any(String),
            manifestations_id: manifestation.id,
            users_id: userProfile.id,
          }),
        ])
      );
    });

    it('fetch manifestation status files successful', async () => {
      const response = await request(app)
        .get(`/files/status/${manifestationStatus.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: 'sample.txt',
            name_in_server: 'sample-123456789.txt',
            extension: '.txt',
            created_at: expect.any(String),
            updated_at: expect.any(String),
            manifestations_status_id: manifestationStatus.id,
            users_id: userProfile.id,
          }),
        ])
      );
    });
  });

  describe('SHOW', () => {
    it("doesn't show inexistent file", async () => {
      const response = await request(app)
        .get('/files/0')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Arquivo não existe.');
    });
  });
});
