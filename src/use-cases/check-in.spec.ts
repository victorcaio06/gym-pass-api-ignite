import { Decimal } from '@prisma/client/runtime/library';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckInUseCase } from './check-in';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-of-number-check-ins-error';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-id-test',
      title: 'Academia FF',
      description: 'Seu objetivo nossa meta',
      phone: '8888888888',
      latitude: -5.1918047,
      longitude: -39.2894742,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id-test',
      userId: 'user-id-test',
      userLatitude: -5.1918047,
      userLongitude: -39.2894742,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-id-test',
      userId: 'user-id-test',
      userLatitude: -5.1918047,
      userLongitude: -39.2894742,
    });

    await expect(async () => {
      await sut.execute({
        gymId: 'gym-id-test',
        userId: 'user-id-test',
        userLatitude: -5.1918047,
        userLongitude: -39.2894742,
      });
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-id-test',
      userId: 'user-id-test',
      userLatitude: -5.1918047,
      userLongitude: -39.2894742,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-id-test',
      userId: 'user-id-test',
      userLatitude: -5.1918047,
      userLongitude: -39.2894742,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-id-test-2',
      title: 'Academia FF',
      description: 'Seu objetivo nossa meta',
      phone: '8888888888',
      latitude: new Decimal(-5.1644082),
      longitude: new Decimal(-39.2775438),
    });

    await expect(async () => {
      await sut.execute({
        gymId: 'gym-id-test-2',
        userId: 'user-id-test',
        userLatitude: -5.1918047,
        userLongitude: -39.2894742,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
