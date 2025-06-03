import { UserRepository } from './user.repository';
import { hashPassword, comparePassword } from '../../utils/hash';
import { generateToken } from '../../utils/jwt';
import { User } from '@prisma/client';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export class UserService {
  private userRepository = new UserRepository();

  async register(data: CreateUserDTO): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) throw new Error('Email já está em uso.');

    const hashedPassword = await hashPassword(data.password);
    const newUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(data: LoginDTO): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new Error('Credenciais inválidas.');

    const passwordMatch = await comparePassword(data.password, user.password);
    if (!passwordMatch) throw new Error('Credenciais inválidas.');

    const token = generateToken({ userId: user.id });

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async getById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async listAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.listAll();
    return users;
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  async updateUser(id: number, data: Partial<Omit<User, 'id' | 'createdAt' | 'password'>>): Promise<Omit<User, 'password'>> {
    const updated = await this.userRepository.update(id, data);
    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }
}
