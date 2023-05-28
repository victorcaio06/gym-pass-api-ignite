import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { hash } from 'bcryptjs';
import { CheckInUseCase } from './check-in';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('Check in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);
  });
  it('should be able to check in', async () => {
    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-id-test',
      user_id: 'user-id-test',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
