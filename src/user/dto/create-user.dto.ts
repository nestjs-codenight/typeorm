import {IsEmail, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;
  @IsString()
  @IsNotEmpty()
  last_name: string;
  @IsNumber()
  @IsNotEmpty()
  age: number;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
