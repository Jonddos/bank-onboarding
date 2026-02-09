import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateOnboardingDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @Matches(/^[0-9]{6,12}$/, {
    message: 'documentNumber debe ser numérico (6 a 12 dígitos)',
  })
  documentNumber: string;

  @IsEmail()
  email: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  initialAmount: number;
}
