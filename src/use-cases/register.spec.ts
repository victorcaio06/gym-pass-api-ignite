import { describe, expect, it } from 'vitest';
import { compare } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { RegisterUseCase } from '@/use-cases/register';

describe('Register User Case', () => {
  it('should be able to register a new User', async () => {
    const inMemoryUserRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUserRepository);

    const { user } = await registerUseCase.execute({
      name: 'Victor Caio',
      email: 'test@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const inMemoryUserRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUserRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const inMemoryUserRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUserRepository);

    const email = 'caio@back.com';

    await registerUseCase.execute({
      name: 'Caião do Back',
      email,
      password: '123456',
    });

    await expect(() =>
      registerUseCase.execute({
        name: 'Test same email',
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
