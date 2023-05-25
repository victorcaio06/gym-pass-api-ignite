import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'crypto';

import { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);

    if (!user) return null;

    return user;
  }
}
