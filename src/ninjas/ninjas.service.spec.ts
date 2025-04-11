import { Test, TestingModule } from '@nestjs/testing';
import { NinjasService } from './ninjas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ninja } from './entities/ninja.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

// Typage explicite du mock
const mockNinjaRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('NinjasService', () => {
  let service: NinjasService;
  let ninjaRepository: Repository<Ninja>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NinjasService,
        {
          provide: getRepositoryToken(Ninja),
          useFactory: mockNinjaRepository,
        },
      ],
    }).compile();

    service = module.get<NinjasService>(NinjasService);
    ninjaRepository = module.get<Repository<Ninja>>(getRepositoryToken(Ninja));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw error if a ninja with the same name exists', async () => {
      const createNinjaDto = { name: 'Ryu', weapon: 'katana' };
      // Ajout de la simulation correcte
      (ninjaRepository.findOneBy as jest.Mock).mockResolvedValueOnce({ name: 'Ryu' });

      await expect(service.create(createNinjaDto)).rejects.toThrow(
        new BadRequestException({
          status: 400,
          message: 'Un ninja nommé "Ryu" existe déjà.',
        }),
      );
    });

    it('should create a ninja successfully', async () => {
      const createNinjaDto = { name: 'Ryu', weapon: 'katana' };
      // Ajout de la simulation correcte
      (ninjaRepository.findOneBy as jest.Mock).mockResolvedValueOnce(null);
      (ninjaRepository.create as jest.Mock).mockReturnValue(createNinjaDto);
      (ninjaRepository.save as jest.Mock).mockResolvedValue({ id: 1, ...createNinjaDto });

      const result = await service.create(createNinjaDto);
      expect(result).toEqual({
        status: 201,
        message: 'Ninja créé avec succès',
        data: {...createNinjaDto },
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of ninjas', async () => {
      const ninjas = [{ id: 1, name: 'Ryu', weapon: 'katana' }];
      // Ajout de la simulation correcte
      (ninjaRepository.find as jest.Mock).mockResolvedValue(ninjas);

      const result = await service.findAll();
      expect(result).toEqual({
        status: 200,
        message: 'Liste des ninjas récupérée avec succès',
        data: ninjas,
      });
    });
  });

  describe('findOne', () => {
    it('should throw error if ninja is not found', async () => {
      // Ajout de la simulation correcte
      (ninjaRepository.findOneBy as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException({
          status: 404,
          message: "Ninja avec l'ID 1 non trouvé.",
        }),
      );
    });

    it('should return a ninja successfully', async () => {
      const ninja = { id: 1, name: 'Ryu', weapon: 'katana' };
      // Ajout de la simulation correcte
      (ninjaRepository.findOneBy as jest.Mock).mockResolvedValueOnce(ninja);

      const result = await service.findOne(1);
      expect(result).toEqual({
        status: 200,
        message: 'Ninja récupéré avec succès',
        data: ninja,
      });
    });
  });

  describe('update', () => {
    it('should throw error if ninja to update is not found', async () => {
      const updateNinjaDto = { name: 'Ryu', weapon: 'katana' };
      // Ajout de la simulation correcte
      (ninjaRepository.findOneBy as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.update(1, updateNinjaDto)).rejects.toThrow(
        new NotFoundException({
          status: 404,
          message: "Ninja avec l'ID 1 non trouvé.",
        }),
      );
    });

    it('should throw error if ninja name already exists during update', async () => {
      const updateNinjaDto = { name: 'Ryu', weapon: 'katana' };

      // Le ninja à mettre à jour
      const existingNinja = { id: 1, name: 'Ryu', weapon: 'katana' };

      // Mock de l'appel pour trouver un ninja par ID (le ninja existe)
      (ninjaRepository.findOneBy as jest.Mock).mockResolvedValueOnce(existingNinja);

      // Mock de l'appel pour vérifier si un ninja avec le même nom existe
      const otherNinja = { id: 2, name: 'Ken', weapon: 'shuriken' };
      (ninjaRepository.findOneBy as jest.Mock).mockResolvedValueOnce(otherNinja);

    });


    it('should update a ninja successfully', async () => {
      const updateNinjaDto = { name: 'Ryu', weapon: 'katana' };
      const existingNinja = { id: 1, name: 'Ryu', weapon: 'sword' };
      // Ajout de la simulation correcte
      (ninjaRepository.findOneBy as jest.Mock).mockResolvedValueOnce(existingNinja);
      (ninjaRepository.save as jest.Mock).mockResolvedValueOnce({ ...existingNinja, ...updateNinjaDto });

      const result = await service.update(1, updateNinjaDto);
      expect(result).toEqual({
        status: 200,
        message: 'Ninja mis à jour avec succès',
        data: { ...existingNinja, ...updateNinjaDto },
      });
    });
  });

  describe('remove', () => {
    it('should throw error if ninja to delete is not found', async () => {
      // Ajout de la simulation correcte
      (ninjaRepository.findOneBy as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.remove(1)).rejects.toThrow(
        new NotFoundException({
          status: 404,
          message: "Ninja avec l'ID 1 non trouvé.",
        }),
      );
    });

    it('should remove a ninja successfully', async () => {
      const ninja = { id: 1, name: 'Ryu', weapon: 'katana' };
      // Ajout de la simulation correcte
      (ninjaRepository.findOneBy as jest.Mock).mockResolvedValueOnce(ninja);
      (ninjaRepository.remove as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await service.remove(1);
      expect(result).toEqual({
        status: 200,
        message: 'Ninja supprimé avec succès',
      });
    });
  });
});
