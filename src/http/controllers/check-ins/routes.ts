import { FastifyInstance } from 'fastify';

import { verifyJwt } from '../../middlewares/verify-jwt';
import { create } from './create';
import { metrics } from './metrics';
import { validate } from './validate';
import { history } from './history';

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post('/gyms/:gymId/check-ins', create);

  app.get('/check-ins/history', history);
  app.get('/check-ins/metrics', metrics);
  
  app.patch('/check-ins/:checkInId/validate', validate);
}
