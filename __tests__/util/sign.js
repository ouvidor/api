import request from 'supertest';

import app from '../../src/App';

class Sign {
  // registra usuário
  async up(user) {
    const response = await request(app)
      .post('/user')
      .send(user);

    return response;
  }

  // login
  async in(user, city = 'Cabo Frio') {
    const { body } = await request(app)
      .post('/auth')
      .send({ ...user, city });

    return { user: body.user, token: body.token, city: body.city };
  }
}

export default new Sign();
