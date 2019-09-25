import request from 'supertest';
import Bcrypt from 'bcrypt';

import app from '../../src/App';
import factory from '../factories';
import truncate from '../util/truncate';

describe('User', () => {
  // entre todos os testes é feito o truncate da tabela
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt the user password when a new user is created', async () => {
    const user = await factory.create('User', {
      // passando uma senha estática para poder comparar depois
      passwordTemp: '123456',
    });

    const hashComparisonResult = await Bcrypt.compare('123456', user.password);

    expect(hashComparisonResult).toBe(true);
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    // registra usuário
    const response = await request(app)
      .post('/user/create')
      .send(user);

    // checa se tem as seguintes propriedades
    expect(response.body).toHaveProperty('email', 'id', 'name');
  });

  it("shouldn't be able to register duplicated email", async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/user/create')
      .send(user);

    const response = await request(app)
      .post('/user/create')
      .send(user);

    // checa se o status da resposta HTTP é 400
    expect(response.status).toBe(400);
    // checa se tem as seguintes propriedades
    expect(response.body).toHaveProperty('error');
    // checa se a mensagem de erro está correta
    expect(response.body.error).toContain('Email já cadastrado');
  });

  it("shouldn't register, invalid password and email", async () => {
    const user = await factory.attrs('User');
    user.password = '123';
    user.email = 'a';

    const response = await request(app)
      .post('/user/create')
      .send(user);

    // espera requisição invalida
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Validação falhou');
    expect(response.body.messages).toEqual(
      expect.arrayContaining(['Email invalido', 'Senha abaixo de 6 caracteres'])
    );
  });

  it("shouldn't register, missing name, password and email", async () => {
    const response = await request(app)
      .post('/user/create')
      .send();

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Validação falhou');
    expect(response.body.messages).toEqual(
      expect.arrayContaining([
        'Nome é necessário',
        'Email é necessário',
        'Senha é necessária',
      ])
    );
  });
});
