import {
  IsString,
  IsInt,
  IsEmail,
  MinLength,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer'


export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}

export class RegisterUserDto {
  @IsEmail({}, { message: 'Must provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(4, { message: 'Username must be atleast 4 characters long' })
  username: string;

  @IsInt({ message: "Age must be an integer" })
  @Min(18, { message: 'You must be at least 18 years or older.' })
  @Max(100, { message: 'Age cannot exceed 100' })
  age: number;

  @IsArray()
  @IsString({ each: true, message: 'Each skill must be a string' })
  skills: string[]

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto
}

