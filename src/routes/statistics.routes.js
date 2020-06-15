import { Router } from 'express';
import { parseISO, isValid } from 'date-fns';

import StatisticValidator from '../middlewares/validators/Statistics';
import generateReport from '../services/Statatistics/report';
import generateHeatmap from '../services/Statatistics/heatmap';
import generateStatistic from '../services/Statatistics/statistic';

const statisticsRoutes = Router();

statisticsRoutes.get(
  '/',
  StatisticValidator.report,
  async (request, response) => {
    const { init, end, city } = request.query;

    const parsedInitDate = parseISO(init);
    const parsedEndDate = parseISO(end);

    if (!isValid(parsedInitDate) || !isValid(parsedEndDate)) {
      return response.status(400).json({ message: 'Essa data é invalida.' });
    }

    const statistics = await generateReport({
      init,
      end,
      cityName: city,
    });

    return response.status(200).json(statistics);
  }
);

statisticsRoutes.get(
  '/heatmap',
  StatisticValidator.heatmap,
  async (request, response) => {
    const { init, end, city } = request.query;

    const parsedInitDate = parseISO(init);
    const parsedEndDate = parseISO(end);

    if (!isValid(parsedInitDate) || !isValid(parsedEndDate)) {
      return response.status(400).json({ message: 'Essa data é invalida.' });
    }

    const heatmap = await generateHeatmap({
      init,
      end,
      cityName: city,
    });

    return response.status(200).json(heatmap);
  }
);

statisticsRoutes.get(
  '/types',
  StatisticValidator.statistic,
  async (request, response) => {
    const { init, end, city } = request.query;

    const parsedInitDate = parseISO(init);
    const parsedEndDate = parseISO(end);

    if (!isValid(parsedInitDate) || !isValid(parsedEndDate)) {
      return response.status(400).json({ message: 'Essa data é invalida.' });
    }

    const statistic = await generateStatistic({
      init,
      end,
      cityName: city,
    });

    return response.status(200).json(statistic);
  }
);

export default statisticsRoutes;
