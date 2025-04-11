import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NinjaDto {
  @ApiProperty({ example: 'Naruto Uzumaki' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis.' })
  @Length(2, 50, { message: 'Le nom doit contenir entre 2 et 50 caractères.' })
  name: string;

  @ApiProperty({ example: 'Rasengan' })
  @IsString()
  @IsNotEmpty({ message: 'L\'arme est requise.' })
  @Length(2, 50, { message: 'L\'arme doit contenir entre 2 et 50 caractères.' })
  weapon: string;
}
