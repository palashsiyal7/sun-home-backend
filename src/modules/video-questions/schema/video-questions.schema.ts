import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Types } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';
import { Video } from 'src/modules/video/schema/video.schema';

@Schema({
  timestamps: true,
})
export class VideoQuestions {
  @ApiProperty()
  @Prop({ required: false })
  question: string;

  @ApiProperty()
  @Prop({ required: false, default: '' })
  answer: string;

  @ApiProperty({ type: Types.ObjectId, description: 'Role' })
  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacher: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
  lecture: Types.ObjectId;
}

export const VideoQuestionsSchema =
  SchemaFactory.createForClass(VideoQuestions);
