import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search.gyms';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -5.1758625,
      longitude: -39.2740691,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -5.1199581,
      longitude: -39.2025938,
    });

    const { gyms } = await sut.execute({
      userLatitude: -5.1838976,
      userLongitude: -39.288832,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
