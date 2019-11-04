import request from 'supertest';

import app from '../../src/App';

export default async function registerUser(user) {
  // registra usuário
  const response = await request(app)
    .post('/auth')
    .send(user);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('token');
  expect(response.body).toHaveProperty('user');

  return response.body;
}
