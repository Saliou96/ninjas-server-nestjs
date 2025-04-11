// src/auth/users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }

  async create(username: string, password: string, role: 'ADMIN' | 'NINJA') {
    const exists = await this.findByUsername(username);
    if (exists) throw new ConflictException('Username already exists');

    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ username, password: hash, role });
    return this.usersRepo.save(user);
  }
}
