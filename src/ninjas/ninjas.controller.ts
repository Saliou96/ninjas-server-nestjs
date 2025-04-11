import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NinjasService } from './ninjas.service';
import { NinjaDto } from './dto/ninja.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Ninjas')
@Controller('ninjas')
export class NinjasController {
  constructor(private readonly ninjasService: NinjasService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un ninja' })
  @ApiResponse({ status: 201, description: 'Ninja créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Nom déjà existant ou données invalides.' })
  create(@Body() createNinjaDto: NinjaDto) {
    return this.ninjasService.create(createNinjaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les ninjas' })
  @ApiResponse({ status: 200, description: 'Liste des ninjas.' })
  findAll() {
    return this.ninjasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un ninja par ID' })
  @ApiResponse({ status: 200, description: 'Ninja trouvé.' })
  @ApiResponse({ status: 404, description: 'Ninja introuvable.' })
  findOne(@Param('id') id: number) {
    return this.ninjasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un ninja' })
  @ApiResponse({ status: 200, description: 'Ninja mis à jour.' })
  @ApiResponse({ status: 404, description: 'Ninja non trouvé.' })
  update(@Param('id') id: string, @Body() updateNinjaDto: NinjaDto) {
    return this.ninjasService.update(+id, updateNinjaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un ninja' })
  @ApiResponse({ status: 200, description: 'Ninja supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Ninja introuvable.' })
  remove(@Param('id') id: string) {
    return this.ninjasService.remove(+id);
  }
}
