import { IsMongoId, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePracticeDetails {
  @IsMongoId()
  practiceId: Types.ObjectId;

  @IsMongoId()
  userId: Types.ObjectId;

  @IsArray()
  queArr: [];

  @IsArray()
  chapters: [];

  analytics?: [];

  queAnalytics?: [];
}
