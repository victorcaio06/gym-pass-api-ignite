import { Gym, Prisma } from '@prisma/client';
import { GymsRepository, findManyNearbyParams } from '../gyms-repository';
import { randomUUID } from 'crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.gyms.push(gym);

    return gym;
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id);

    if (!gym) return null;

    return gym;
  }

  async searchMany(query: string, page: number) {
    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby({ latitude, longitude }: findManyNearbyParams) {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude,
          longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        }
      );
      console.log(distance);
      return distance < 10;
    });
  }
}
