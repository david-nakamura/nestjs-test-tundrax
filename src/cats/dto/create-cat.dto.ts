import { IsNumberString, IsString } from 'class-validator';

export class CreateCatDto {
  @IsString({ message: 'Name must be a string.' })
  readonly name: string;

  @IsNumberString({}, { message: 'Age must be a number.' })
  readonly age: number;

  @IsString({ message: 'Breed must be a string.' })
  readonly breed: string;
}
