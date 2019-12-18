import request from 'supertest';
import Bcrypt from 'bcrypt';

import app from '../../src/App';
import factory from '../factories';
import truncate from '../util/truncate';
import sign from '../util/sign';

const adminMaster = {
  email: 'root@gmail.com',
  password: '123456',
};

describe('User', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt the user password when a new user is created', async () => {
    const user = await factory.create('User', {
      // passando uma senha estática para poder comparar depois
      password: '123456',
    });

    const hashComparisonResult = await Bcrypt.compare('123456', user.password);

    expect(hashComparisonResult).toBe(true);
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await sign.up(user);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'id',
      'email',
      'first_name',
      'last_name'
    );
  });

  it('should register a user with admin master', async () => {
    const { body: master } = await sign.in(adminMaster);
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${master.token}`)
      .send(user);

    expect(response.status).toBe(200);
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

    // checa se o status da resposta HTTP é 400
    expect(response.status).toBe(400);
    // checa se tem as seguintes propriedades
    expect(response.body).toHaveProperty('error');
    // checa se a mensagem de erro está correta
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
    const { body } = await sign.in(user);

    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${body.token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty(
      'email',
      'first_name',
      'id',
      'last_name',
      'role'
    );

    expect(response.body[0].role[0]).toHaveProperty('level', 'id', 'title');
  });

  it('should list a specific user', async () => {
    const user = { email: 'root@gmail.com', password: '123456' };
    const { body } = await sign.in(user); // login

    const response = await request(app)
      .get(`/user/${body.user.id}`)
      .set('Authorization', `Bearer ${body.token}`)
      .send();

    expect(response.body).toHaveProperty(
      'email',
      'first_name',
      'id',
      'last_name',
      'role'
    );
    expect(response.body.role[0]).toHaveProperty('level', 'id', 'title');
  });

  it("shouldn't list a specific user", async () => {
    const user = { email: 'root@gmail.com', password: '123456' };

    // cadastro
    await sign.up(user);
    // login
    const { body } = await sign.in(user);

    const response = await request(app)
      .get(`/user/0`)
      .set('Authorization', `Bearer ${body.token}`)
      .send();

    expect(response.body).toHaveProperty('error', 'esse usuário não existe');
  });

  it('should be able to update', async () => {
    const user = await factory.attrs('User');
    // cadastro
    await sign.up(user);
    // login
    const { body } = await sign.in(user);

    const response = await request(app)
      .put(`/user/${body.user.id}`)
      .set('Authorization', `Bearer ${body.token}`)
      .send({ email: 'new@email.com' });

    expect(response.body).toHaveProperty(
      'id',
      'email',
      'first_name',
      'last_name'
    );
  });
});
