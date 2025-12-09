import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../users/repositories/user.repository';
import { HashService } from '../common/services/hash.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user
   * @param registerDto - Registration data
   * @returns Authentication response with token and user data
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name } = registerDto;

    // Check if email already exists
    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashService.hashPassword(password);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: 'user',
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const access_token = this.generateToken(savedUser);

    // Return response without password
    return {
      access_token,
      user: this.mapUserToResponse(savedUser),
    };
  }

  /**
   * Authenticates a user and returns JWT token
   * @param loginDto - Login credentials
   * @returns Authentication response with token and user data
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare password
    const isPasswordValid = await this.hashService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const access_token = this.generateToken(user);

    // Return response without password
    return {
      access_token,
      user: this.mapUserToResponse(user),
    };
  }

  /**
   * Validates user credentials
   * @param email - User email
   * @param password - User password
   * @returns User object without password if valid, null otherwise
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.hashService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Generates JWT token for user
   * @param user - User entity
   * @returns JWT token string
   */
  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Maps User entity to UserResponseDto
   * @param user - User entity
   * @returns User response DTO without password
   */
  private mapUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
