import { Router } from 'express';

import UserLoginValidator from '../middlewares/validators/UserLogin';
import login from '../services/Auth/login';

const authRoutes = Router();

authRoutes.post('/', UserLoginValidator, async (request, response) => {
  const { email, city } = request.body;
  const password = String(request.body.password);

  const { user, token, city: confirmedCity } = await login({
    city,
    password,
    email,
  });

  return response.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    },
    token,
    city: confirmedCity,
  });
});

export default authRoutes;
