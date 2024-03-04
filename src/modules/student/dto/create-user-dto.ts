import { IsNumber, IsString, IsEmail, IsDateString, IsEnum, IsOptional, IsNumberString, IsBoolean, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { Gender } from '../schema/student.schema';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsNumberString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsDateString()
  dob: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsEnum(Gender)
  gender: string;

  @IsNumber()
  status: number;
}

export class CreateStudentDto extends CreateUserDto {
  @IsBoolean()
  @IsOptional()
  isFavorite: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  courses: string[];

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsNumber()
  userType: number;
}

export class CreateTeacherDto extends CreateUserDto {
  @IsString()
  subject: string;

  @IsBoolean()
  @IsOptional()
  isFavorite: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  userType: number;
}

