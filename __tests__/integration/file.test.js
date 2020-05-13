import request from 'supertest';

import app from '../../src/App';
import truncate from '../util/truncate';
import factory from '../factories';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';
import File from '../../src/models/File';
import Manifestation from '../../src/models/Manifestation';

let token;
let manifestation;
let userProfile;

describe('File', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeAll(async () => {
    await truncate();
    const { ombudsman, category, types } = await seedDatabase();
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

    await File.create({
      name: 'sample.txt',
      name_in_server: 'sample-123456789.txt',
      extension: '.txt',
      manifestations_id: manifestation.id,
      users_id: user.id,
    });
  });

  describe('FETCH', () => {
    it('fetch files successful', async () => {
      const response = await request(app)
        .get(`/files/manifestation/${manifestation.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toEqual(
        expect.objectContaining({
          files: expect.arrayContaining([
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
          ]),
        })
      );
    });

    it('cannot fetch files, not owner and not admin', async () => {
      const user = await factory.attrs('User');
      await sign.up(user);

      const { token: citizenToken } = await sign.in(user);

      const response = await request(app)
        .get(`/files/manifestation/${manifestation.id}`)
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
