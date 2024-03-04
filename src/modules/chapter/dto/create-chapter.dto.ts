import { IsString, IsBoolean, IsMongoId, IsNumber } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  chapterName: string;

  @IsMongoId()
  subject: string;

  @IsNumber()
  chapterNo: number;
  
  @IsBoolean()
  isActive: boolean;
}
