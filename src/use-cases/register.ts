import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error('E-mail already exists!');
    }

    const password_hash = await hash(password, 6);

    // const prismaUserRepository = new PrismaUsersRepository();

    const userCreated = await this.userRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
