import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Register User Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it('should be able to register a new User', async () => {
    const { gym } = await sut.execute({
      title: 'gym-test-1',
      description: null,
      phone: null,
      latitude: -4.9617084,
      longitude: -39.0189615,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
