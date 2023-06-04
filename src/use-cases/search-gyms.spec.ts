import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search.gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Jv Gym',
      description: null,
      phone: null,
      latitude: -5.1918047,
      longitude: -39.2894742,
    });

    await gymsRepository.create({
      title: 'Typescript gym',
      description: null,
      phone: null,
      latitude: -5.1918047,
      longitude: -39.2894742,
    });

    const { gyms } = await sut.execute({
      query: 'Jv',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Jv Gym',
      }),
    ]);
  });

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Typescript gym ${i}`,
        description: null,
        phone: null,
        latitude: -5.1918047,
        longitude: -39.2894742,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Typescript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Typescript gym 21',
      }),
      expect.objectContaining({
        title: 'Typescript gym 22',
      }),
    ]);
  });
});
