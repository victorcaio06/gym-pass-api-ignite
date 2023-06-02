import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CheckInUseCase } from './check-in';
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins-history';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsUseCase;

describe('Fetch User Check-in history Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsUseCase(checkInsRepository);
  });

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-test-1',
      user_id: 'user-id-test',
    });

    await checkInsRepository.create({
      gym_id: 'gym-test-2',
      user_id: 'user-id-test',
    });

    const { checkIns } = await sut.execute({
      userId: 'user-id-test',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-test-1',
      }),
      expect.objectContaining({
        gym_id: 'gym-test-2',
      }),
    ]);
  });

  it('should be able to fetch paginated user check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-test-${i}`,
        user_id: 'user-id-test',
      });
    }

    const { checkIns } = await sut.execute({
      userId: 'user-id-test',
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-test-21',
      }),
      expect.objectContaining({
        gym_id: 'gym-test-22',
      }),
    ]);
  });
});
