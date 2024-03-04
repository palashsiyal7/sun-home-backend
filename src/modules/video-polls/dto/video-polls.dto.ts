import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class VideoPollsDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  popupTime: string;

  @IsString()
  @IsNotEmpty()
  runningTime: string;

  @IsArray()
  options: string[];

  @IsString()
  @IsNotEmpty()
  lecture: string;
}
