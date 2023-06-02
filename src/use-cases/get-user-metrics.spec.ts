import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CheckInUseCase } from './check-in';
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins-history';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-test-1',
      user_id: 'user-id-test',
    });

    await checkInsRepository.create({
      gym_id: 'gym-test-2',
      user_id: 'user-id-test',
    });

    const { checkInsCount } = await sut.execute({
      userId: 'user-id-test',
    });

    expect(checkInsCount).toEqual(2);
  });
});
