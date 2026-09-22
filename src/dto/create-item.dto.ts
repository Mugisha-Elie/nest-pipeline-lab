import { IsArray, IsInt, IsNotEmpty, IsPositive, IsString, MinLength } from "class-validator";

export class CreateItemClassDto {
  @IsString({ message: 'Item name must be a valid string' })
  @IsNotEmpty({ message: 'Item name cannot be empty' })
  @MinLength(3, { message: 'Item name must have at least 3 characters' })
  name: string;

  @IsInt({ message: 'Price must be an integer' })
  @IsPositive({ message: 'Price must be greater than zero' })
  price: number;

  @IsArray({ message: 'Tags must be an array of strings' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags: string[]
}

