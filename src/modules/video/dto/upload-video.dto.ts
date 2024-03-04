import { IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
// import { FileNotEmpty } from '../pipe/file-not-empty.pipe';

export class UploadVideoDto {
  // videoFile: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  videoURL: string;

  @IsNotEmpty()
  @IsString()
  thumbnailURL: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  teacher: string;

  @IsNotEmpty()
  @IsString()
  course: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsString()
  @IsNotEmpty()
  chapter: string;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsOptional()
  publishDate: string;

  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  @IsOptional()
  endTime: string;

  @IsOptional()
  isLatest: boolean;
}

export type UploadVideoForFileUpload = Omit<
  UploadVideoDto,
  'videoURL' | 'thumbnailURL'
>;
