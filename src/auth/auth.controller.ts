// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Se connecter' })
  @ApiResponse({ status: 200, description: 'Authentification réussie' })
  @ApiResponse({ status: 401, description: "Échec de l'authentification" })
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    return this.authService.login(user);
  }

  @ApiOperation({ summary: "S'inscrire" })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 400, description: 'Erreur lors de la création' })
  @Post('register')
  async register(
    @Body()
    body: { username: string; password: string; role: 'ADMIN' | 'NINJA' }, // Utilisation du role
  ) {
    return this.authService.register(body.username, body.password, body.role); // Passage des 3 paramètres
  }
}
