import { Module } from '@nestjs/common';
import { NinjasService } from './ninjas.service';
import { NinjasController } from './ninjas.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports : [DatabaseModule],
  controllers: [NinjasController],
  providers: [NinjasService],
})
export class NinjasModule {}
