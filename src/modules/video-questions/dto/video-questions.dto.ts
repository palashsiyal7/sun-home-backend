import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VideoQuestionsDto {
  @IsString()
  question: string;

  @IsString()
  @IsOptional()
  answer: string;

  @IsNotEmpty()
  @IsString()
  student: string;

  @IsNotEmpty()
  @IsString()
  teacher: string;

  @IsNotEmpty()
  @IsString()
  lecture: string;
}
