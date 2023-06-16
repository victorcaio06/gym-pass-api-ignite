import { FastifyInstance } from 'fastify';

import { verifyJwt } from '../../middlewares/verify-jwt';
import { nearby } from './nearby';
import { search } from './search';
import { create } from './create';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post('/gyms', create);

  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);
}
