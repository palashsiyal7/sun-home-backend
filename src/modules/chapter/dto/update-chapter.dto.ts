import { IsString, IsBoolean, IsMongoId, IsNumber } from 'class-validator';

export class UpdateChapterDto {
  @IsString()
  chapterName: string;

  @IsMongoId()
  subject: string;

  @IsNumber()
  chapterNo: number;

  @IsBoolean()
  isActive: boolean;
}
