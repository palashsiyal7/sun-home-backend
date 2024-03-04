import {
  IsString,
  IsNumber,
  IsEmail,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsArray,
  ArrayUnique,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { Gender } from '../schema/student.schema';

export class CreateStudentDto {
  @IsString()
  studentName: string;

  @IsNumber()
  phoneNumber: number;

  @IsEmail()
  email: string;

  @IsDateString()
  dob: Date;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsEnum(Gender)
  gender: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  courses: string[];

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsNumber()
  status: number;

  @IsNumber()
  userType: number;

  @IsOptional()
  @IsString()
  refCode?: string; // Add refCode as an optional property
    static studentName: any;
}
