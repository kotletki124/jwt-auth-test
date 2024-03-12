import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  GetUserByDto,
  CheckEmailDto,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async getUserBy(
    query: GetUserByDto,
    options: FindOneOptions<User> = {},
  ): Promise<User> {
    return this.userRepository.findOne({ where: query, ...options });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserBy({ id });
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async isEmailAvailable(checkEmailDto: CheckEmailDto): Promise<boolean> {
    const user = await this.userRepository.findOneBy(checkEmailDto);
    return !user;
  }
}
