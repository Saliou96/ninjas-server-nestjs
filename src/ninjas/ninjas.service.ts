import { Injectable } from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';
import { Ninja } from './entities/ninja.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NinjasService {
  constructor(
    @InjectRepository(Ninja)
    private ninjaRepository: Repository<Ninja>,
  ) {}

  create(createNinjaDto: CreateNinjaDto) {
    return 'This action adds a new ninja';
  }

  findAll(): Promise<Ninja[]> {
    return this.ninjaRepository.find();
  }

  findOne(id: number) {
    return
  }

  update(id: number, updateNinjaDto: UpdateNinjaDto) {
    return `This action updates a #${id} ninja`;
  }

  remove(id: number) {
    return `This action removes a #${id} ninja`;
  }
}
