import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  // Trouver un ninja par ID
  async findOne(id: any): Promise<Ninja> {
    const ninja = await this.ninjaRepository.findOneBy(id);
    if (!ninja) {
      throw new NotFoundException(`Ninja with ID ${id} not found`);
    }
    return ninja;
  }

  // Mettre à jour un ninja
  async update(id: number, updateNinjaDto: UpdateNinjaDto): Promise<Ninja> {
    const ninja = await this.findOne(id); // Vérifie d'abord si le ninja existe

    try {
      // Met à jour les champs du ninja
      Object.assign(ninja, updateNinjaDto);
      return await this.ninjaRepository.save(ninja);
    } catch (error) {
      throw new BadRequestException('Error updating ninja');
    }
  }

  // Supprimer un ninja
  async remove(id: number): Promise<void> {
    const ninja = await this.findOne(id); // Vérifie d'abord si le ninja existe

    try {
      await this.ninjaRepository.remove(ninja);
    } catch (error) {
      throw new BadRequestException('Error removing ninja');
    }
  }
}
