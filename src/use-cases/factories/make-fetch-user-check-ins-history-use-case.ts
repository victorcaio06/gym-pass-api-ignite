import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { FetchUserCheckInsUseCase } from '../fetch-user-check-ins-history';

export function makeFetchUserCheckInsHistoryUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository();

  const useCase = new FetchUserCheckInsUseCase(prismaCheckInsRepository);

  return useCase;
}
