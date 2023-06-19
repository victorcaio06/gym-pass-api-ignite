import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John',
      email: 'johnDoe@example.com',
      password: '123456',
    });

    const authResponse = await request(app.server)
      .patch('/token/refresh')
      .send({
        email: 'johnDoe@example.com',
        password: '123456',
      });

    const cookies = authResponse.get('Set-Cookie');

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ refreshToken: expect.any(String) });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken=')
    ])
  });
});
