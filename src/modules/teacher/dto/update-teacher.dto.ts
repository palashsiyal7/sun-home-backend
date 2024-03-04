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

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  teacherName?: string;

  @IsOptional()
  @IsMongoId()
  subject?: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  phoneNumber?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: string;
}
