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
  async in(user) {
    const response = await request(app)
      .post('/auth')
      .send(user);

    return response;
  }
}

export default new Sign();
