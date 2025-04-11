import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ninja } from './entities/ninja.entity';
import { NinjaDto } from './dto/ninja.dto';

@Injectable()
export class NinjasService {
  constructor(
    @InjectRepository(Ninja)
    private ninjaRepository: Repository<Ninja>,
  ) {}

  async create(createNinjaDto: NinjaDto) {
    const existing = await this.ninjaRepository.findOneBy({ name: createNinjaDto.name });
    if (existing) {
      throw new BadRequestException({
        status: 400,
        message: `Un ninja nommé "${createNinjaDto.name}" existe déjà.`,
      });
    }

    const ninja = this.ninjaRepository.create(createNinjaDto);
    await this.ninjaRepository.save(ninja);

    return {
      status: 201,
      message: 'Ninja créé avec succès',
      data: ninja,
    };
  }

  async findAll() {
    const ninjas = await this.ninjaRepository.find();
    return {
      status: 200,
      message: 'Liste des ninjas récupérée avec succès',
      data: ninjas,
    };
  }

  async findOne(id: number) {
    const ninja = await this.ninjaRepository.findOneBy({ id });
    if (!ninja) {
      throw new NotFoundException({
        status: 404,
        message: `Ninja avec l'ID ${id} non trouvé.`,
      });
    }

    return {
      status: 200,
      message: 'Ninja récupéré avec succès',
      data: ninja,
    };
  }

  async update(id: number, updateNinjaDto: NinjaDto) {
    const ninja = await this.ninjaRepository.findOneBy({ id });
    if (!ninja) {
      throw new NotFoundException({
        status: 404,
        message: `Ninja avec l'ID ${id} non trouvé.`,
      });
    }

    if (
      updateNinjaDto.name &&
      updateNinjaDto.name !== ninja.name
    ) {
      const existing = await this.ninjaRepository.findOneBy({ name: updateNinjaDto.name });
      if (existing) {
        throw new BadRequestException({
          status: 400,
          message: `Un autre ninja nommé "${updateNinjaDto.name}" existe déjà.`,
        });
      }
    }

    Object.assign(ninja, updateNinjaDto);
    await this.ninjaRepository.save(ninja);

    return {
      status: 200,
      message: 'Ninja mis à jour avec succès',
      data: ninja,
    };
  }

  async remove(id: number) {
    const ninja = await this.ninjaRepository.findOneBy({ id });
    if (!ninja) {
      throw new NotFoundException({
        status: 404,
        message: `Ninja avec l'ID ${id} non trouvé.`,
      });
    }

    await this.ninjaRepository.remove(ninja);

    return {
      status: 200,
      message: 'Ninja supprimé avec succès',
    };
  }
}
