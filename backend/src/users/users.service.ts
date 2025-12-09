import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Finds a user by ID and excludes password
   * @param id - User ID
   * @returns User without password
   */
  async findById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Finds a user by email and excludes password
   * @param email - User email
   * @returns User without password
   */
  async findByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
    });

    return user;
  }

  /**
   * Updates user data
   * @param id - User ID
   * @param updateData - Data to update
   * @returns Updated user without password
   */
  async update(
    id: string,
    updateData: Partial<Omit<User, 'id' | 'password' | 'email'>>,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update only allowed fields
    Object.assign(user, updateData);
    await this.userRepository.save(user);

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
