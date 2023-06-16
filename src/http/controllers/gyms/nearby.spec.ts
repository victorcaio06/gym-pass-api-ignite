import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JV gym',
        description: 'Some description',
        phone: '12345678',
        latitude: -5.1758625,
        longitude: -39.2740691,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TS gym',
        description: 'Some description',
        phone: '12345678',
        latitude: -5.1199581,
        longitude: -39.2025938,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -5.1838976,
        longitude: -39.288832,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JV gym',
      }),
    ]);
  });
});
