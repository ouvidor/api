import request from 'supertest';

import app from '../../src/App';

export default async function registerUser(user) {
  // registra usuário
  const response = await request(app)
    .post('/user/create')
    .send(user);

  return response.body;
}
