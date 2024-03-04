import {
  IsString,
  IsBoolean,
  IsNumber,
  IsEmail,
  IsEnum,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Gender } from '../schema/teacher.schema';

export class CreateTeacherDto {
  @IsString()
  teacherName: string;

  @IsMongoId()
  subject: string;

  @IsBoolean()
  @IsOptional()
  isFavorite: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  phoneNumber: number;

  @IsEmail()
  email: string;

  @IsEnum(Gender)
  gender: string;

  @IsNumber()
  status: number;
    static teacherName: any;
}
