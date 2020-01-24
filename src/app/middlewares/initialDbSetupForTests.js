/**
 * Middleware usado apenas para tests
 * sim, é uma gambiarra
 */

import setupDbInitialData from '../utils/setupDbInitialData';

export default async (req, res, next) => {
  try {
    await setupDbInitialData();

    return next();
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};
