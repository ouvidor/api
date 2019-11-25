import request from 'supertest';

import app from '../../src/App';

class Sign {
  // registra usuário
  async up(user) {
    const response = await request(app)
      .post('/user')
      .send(user);

    return response.body;
  }

  // login
  async in(user) {
    const response = await request(app)
      .post('/auth')
      .send(user);

    return response.body;
  }
}

export default new Sign();
