import { Router } from 'express';
import { parseISO, isValid } from 'date-fns';

import GenerateStatistics from '../services/GenerateStatistics';

const statisticsRoutes = Router();

statisticsRoutes.get('/', async (request, response) => {
  const { date } = request.query;
  const parsedDate = parseISO(date);

  if (!isValid(parsedDate)) {
    return response.status(400).json({ message: 'Essa data é invalida.' });
  }

  const statistics = await GenerateStatistics.run({
    date: parsedDate,
    city: request.user_city,
  });

  return response.status(200).json(statistics);
});

export default statisticsRoutes;
