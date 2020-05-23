import request from 'supertest';

import app from '../../src/App';
import factory from '../factories';
import truncate from '../util/truncate';
import sign from '../util/sign';
import seedDatabase from '../util/seedDatabase';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

let token;
let user;

describe('User', () => {
  beforeAll(async () => {
    await truncate();
    await seedDatabase();

    const { token: signedToken, user: signedUser } = await sign.in({
      ...adminMaster,
      city: 'Cabo Frio',
    });
    token = signedToken;
    user = signedUser;
  });

  describe('POST', () => {
    it('should be able to register a citizen', async () => {
      const randomUser = await factory.attrs('User');

      const response = await sign.up(randomUser);

      // expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'id',
        'email',
        'first_name',
        'last_name'
      );
      expect(response.status).toBe(201);
    });

    it('should register an admin', async () => {
      const response = await request(app)
        .post('/user')
        .set('Authorization', `Bearer ${token}`)
        .send({
          first_name: 'register user',
          last_name: 'with admin master',
          email: 'register@citizen.com',
          password: '123456',
          role: 'admin',
        });

      expect(response.body).toHaveProperty(
        'id',
        'email',
        'first_name',
        'last_name'
      );
      expect(response.status).toBe(201);
    });

    it("shouldn't be able to register duplicated email", async () => {
      const response = await request(app)
        .post('/user')
        .set('Authorization', `Bearer ${token}`)
        .send({
          first_name: 'a',
          last_name: 'a',
          email: 'root@gmail.com',
          password: '123456',
        });

      expect(response.body).toHaveProperty(
        'message',
        'Este email já está cadastrado.'
      );
      expect(response.status).toBe(409);
    });

    it("shouldn't register, invalid password and email", async () => {
      const citizen = await factory.attrs('User', {
        password: '123',
        email: 'a',
      });

      const response = await sign.up(citizen);

      expect(response.body.error).toContain('Validação falhou');
      expect(response.body.messages).toEqual(
        expect.arrayContaining([
          'Email invalido',
          'Senha abaixo de 6 caracteres',
        ])
      );
      expect(response.status).toBe(400);
    });

    it("shouldn't register, missing name, password and email", async () => {
      const response = await sign.up();

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validação falhou');
      expect(response.body.messages).toEqual(
        expect.arrayContaining([
          'Nome é necessário',
          'Sobrenome é necessário',
          'Email é necessário',
          'Senha é necessária',
        ])
      );
    });
  });

  describe('GET', () => {
    it('should list all users', async () => {
      const response = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty(
        'email',
        'first_name',
        'id',
        'last_name',
        'role'
      );

      expect(response.body[0].role).toEqual('master');
    });

    it('should list a specific user', async () => {
      const response = await request(app)
        .get(`/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toHaveProperty(
        'email',
        'first_name',
        'id',
        'last_name',
        'role'
      );
      expect(response.body.role).toEqual('master');
    });

    it("shouldn't list a specific user", async () => {
      const response = await request(app)
        .get(`/user/0`)
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.body).toHaveProperty(
        'message',
        'Esse usuário não existe.'
      );
      expect(response.status).toBe(404);
    });
  });

  describe('UPDATE', () => {
    it('should update and then login', async () => {
      const response = await request(app)
        .put(`/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'new@email.com' });

      expect(response.body).toHaveProperty(
        'id',
        'email',
        'first_name',
        'last_name'
      );

      const result = await sign.in(user);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
    });

    it('should fail to update, citizen cannot change role', async () => {
      const signUpCitizenResponse = await sign.up({
        first_name: 'usuário',
        last_name: 'test',
        email: 'update@citizen.com',
        password: '123456',
      });

      const { token: citizenToken, user: signedCitizen } = await sign.in({
        email: 'update@citizen.com',
        password: '123456',
        city: 'Cabo Frio',
      });

      const response = await request(app)
        .put(`/user/${signedCitizen.id}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({ role: 'admin' });

      expect(response.body).toHaveProperty(
        'message',
        'Você não é um administrador mestre. Mudar o cargo não é permitido.'
      );
      expect(response.status).toBe(403);
    });
  });
});
