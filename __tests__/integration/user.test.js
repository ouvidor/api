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

describe('User', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
    await seedDatabase();
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await sign.up(user);

    // expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'id',
      'email',
      'first_name',
      'last_name'
    );
  });

  it('should register a user with admin master', async () => {
    const { token } = await sign.in(adminMaster);
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    expect(response.body).toHaveProperty(
      'id',
      'email',
      'first_name',
      'last_name'
    );
  });

  it("shouldn't be able to register duplicated email", async () => {
    const user = await factory.attrs('User');

    await sign.up(user);

    const response = await sign.up(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Email já cadastrado');
  });

  it("shouldn't register, invalid password and email", async () => {
    const user = await factory.attrs('User', { password: '123', email: 'a' });

    const response = await sign.up(user);

    // espera requisição invalida
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Validação falhou');
    expect(response.body.messages).toEqual(
      expect.arrayContaining(['Email invalido', 'Senha abaixo de 6 caracteres'])
    );
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

  it('should list all users', async () => {
    const user = { email: 'root@gmail.com', password: '123456' };

    // login
    const { token } = await sign.in(user);

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

    expect(response.body[0].role).toHaveProperty('id');
    expect(response.body[0].role).toHaveProperty('title');
  });

  it('should list a specific user', async () => {
    const { token, user } = await sign.in({
      email: 'root@gmail.com',
      password: '123456',
    });

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
    expect(response.body.role).toHaveProperty('id');
    expect(response.body.role).toHaveProperty('title');
  });

  it("shouldn't list a specific user", async () => {
    const user = { email: 'root@gmail.com', password: '123456' };

    // cadastro
    await sign.up(user);
    // login
    const { token } = await sign.in(user);

    const response = await request(app)
      .get(`/user/0`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.body).toHaveProperty('error', 'esse usuário não existe');
  });

  it('should update and then login', async () => {
    const user = await factory.attrs('User');
    // cadastro
    await sign.up(user);
    // login
    const { user: signedUser, token } = await sign.in(user);

    const response = await request(app)
      .put(`/user/${signedUser.id}`)
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
});
