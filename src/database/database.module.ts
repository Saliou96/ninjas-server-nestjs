import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ninja } from '../ninjas/entities/ninja.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ninjas',
      entities: [Ninja], // Liste de tes entités ici
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Ninja]), // Ajoute les entités que tu veux utiliser dans ce module
  ],
  exports: [TypeOrmModule], // Permet à d'autres modules d'utiliser TypeORM
})
export class DatabaseModule {}
