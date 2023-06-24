import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { create } from './create';
import { nearby } from './nearby';
import { search } from './search';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post(
    '/gyms',
    {
      onRequest: [verifyUserRole('ADMIN')],
    },
    create
  );

  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);
}
