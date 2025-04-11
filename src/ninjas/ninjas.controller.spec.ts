import { Test, TestingModule } from '@nestjs/testing';
import { NinjasController } from './ninjas.controller';
import { NinjasService } from './ninjas.service';
import { NinjaDto } from './dto/ninja.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('NinjasController', () => {
  let controller: NinjasController;
  let service: NinjasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NinjasController],
      providers: [
        {
          provide: NinjasService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 1, name: 'Ryu', weapon: 'katana' }),
            findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Ryu', weapon: 'katana' }]),
            findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Ryu', weapon: 'katana' }),
            update: jest.fn().mockResolvedValue({ message: 'Ninja mis à jour avec succès.', data: { id: 1, name: 'Ryu', weapon: 'katana' } }),
            remove: jest.fn().mockResolvedValue({ message: 'Ninja supprimé avec succès.' }),
          },
        },
      ],
    }).compile();

    controller = module.get<NinjasController>(NinjasController);
    service = module.get<NinjasService>(NinjasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return the newly created ninja', async () => {
      const result = await controller.create({ name: 'Ryu', weapon: 'katana' });
      expect(result).toEqual({ id: 1, name: 'Ryu', weapon: 'katana' });
    });

    it('should throw an error if ninja name already exists', async () => {
      const createNinjaDto = { name: 'Ryu', weapon: 'katana' };
      jest.spyOn(service, 'create').mockRejectedValueOnce(new BadRequestException('Un ninja nommé "Ryu" existe déjà.'));
      await expect(controller.create(createNinjaDto)).rejects.toThrowError(
        new BadRequestException('Un ninja nommé "Ryu" existe déjà.')
      );
    });
  });

  describe('findAll', () => {
    it('should return the list of ninjas', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 1, name: 'Ryu', weapon: 'katana' }]);
    });
  });

  describe('findOne', () => {
    it('should return a single ninja', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual({ id: 1, name: 'Ryu', weapon: 'katana' });
    });

    it('should throw a NotFoundException if ninja not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException('Ninja avec l\'ID 2 non trouvé.'));
      await expect(controller.findOne(2)).rejects.toThrowError(new NotFoundException('Ninja avec l\'ID 2 non trouvé.'));
    });
  });

  describe('update', () => {
    it('should return the updated ninja', async () => {
      const updateNinjaDto = { name: 'Ryu', weapon: 'katana' };
      const result = await controller.update('1', updateNinjaDto);
      expect(result).toEqual({ message: 'Ninja mis à jour avec succès.', data: { id: 1, name: 'Ryu', weapon: 'katana' } });
    });

    it('should throw a NotFoundException if ninja not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValueOnce(new NotFoundException('Ninja avec l\'ID 2 non trouvé.'));
      await expect(controller.update('2', { name: 'Ken', weapon: 'shuriken' })).rejects.toThrowError(
        new NotFoundException('Ninja avec l\'ID 2 non trouvé.')
      );
    });
  });

  describe('remove', () => {
    it('should return a success message when a ninja is deleted', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual({ message: 'Ninja supprimé avec succès.' });
    });

    it('should throw a NotFoundException if ninja not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValueOnce(new NotFoundException('Ninja avec l\'ID 2 non trouvé.'));
      await expect(controller.remove('2')).rejects.toThrowError(new NotFoundException('Ninja avec l\'ID 2 non trouvé.'));
    });
  });
});
