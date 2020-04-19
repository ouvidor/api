import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';
import File from '../../src/app/models/File';
import Category from '../../src/app/models/Category';
import Manifestation from '../../src/app/models/Manifestation';

let token;
let manifestation;
let userProfile;

describe('File', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    await seedDatabase();

    const { user, token: signedToken } = await sign.in({
      email: 'root@gmail.com',
      password: '123456',
    });
    token = signedToken;
    userProfile = user;

    const [category] = await Category.findAll();

    manifestation = await Manifestation.create({
      title: 'title',
      description: 'description',
      read: 0,
      user_id: user.id,
      type_id: 1,
    });
    manifestation.setCategories(category.id);

    await File.create({
      file_name: 'sample.txt',
      file_name_in_server: 'sample-123456789.txt',
      extension: '.txt',
      manifestation_id: manifestation.id,
      user_id: user.id,
    });
  });

  describe('FETCH', () => {
    it('fetch files successful', async () => {
      const response = await request(app)
        .get(`/manifestation/${manifestation.id}/files`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({
          files: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              file_name: 'sample.txt',
              file_name_in_server: 'sample-123456789.txt',
              extension: '.txt',
              created_at: expect.any(String),
              updated_at: expect.any(String),
              manifestation_id: manifestation.id,
              user_id: userProfile.id,
            }),
          ]),
        })
      );
    });

    it('cannot fetch files, not owner and not admin', async () => {
      await sign.up({
        first_name: 'user',
        last_name: 'user',
        email: 'user@gmail.com',
        password: '123456',
      });

      const { token: citizenToken } = await sign.in({
        email: 'user@gmail.com',
        password: '123456',
      });

      const response = await request(app)
        .get(`/manifestation/${manifestation.id}/files`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send();

      expect(response.body).toHaveProperty(
        'message',
        'Não autorizado, apenas administradores e donos do arquivo podem acessa-lo'
      );
    });
  });

  describe('SHOW', () => {
    it("doesn't show inexistent file", async () => {
      const response = await request(app)
        .get('/files/0')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Arquivo não existe');
    });
  });
});
