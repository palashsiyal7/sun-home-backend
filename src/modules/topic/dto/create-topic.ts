import { IsString, IsBoolean, IsMongoId, IsNumber } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  topicName: string;

  @IsNumber()
  topicNo: number;
  
  @IsMongoId()
  chapter: string; 

  @IsMongoId()
  subject: string;
 
  @IsBoolean()
  isActive: boolean;
}
