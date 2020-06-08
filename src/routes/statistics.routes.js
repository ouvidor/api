import { Router } from 'express';
import { parseISO, isValid } from 'date-fns';

import generateReport from '../services/Statatistics/report';

const statisticsRoutes = Router();

statisticsRoutes.get('/', async (request, response) => {
  const { date } = request.query;
  const parsedDate = parseISO(date);

  if (!isValid(parsedDate)) {
    return response.status(400).json({ message: 'Essa data é invalida.' });
  }

  const statistics = await generateReport({
    date: parsedDate,
    city: request.user_city,
  });

  return response.status(200).json(statistics);
});

export default statisticsRoutes;
