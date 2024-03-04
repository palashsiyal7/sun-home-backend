import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class VideoPolls {
  @ApiProperty()
  @Prop({ required: true })
  question: string;

  @ApiProperty()
  @Prop({ required: true, type: [String] })
  options: string[];

  @ApiProperty()
  @Prop({ required: true })
  answer: string;

  @ApiProperty()
  @Prop({ required: true })
  popupTime: string;

  @ApiProperty()
  @Prop({ required: true })
  runningTime: string;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
  lecture: Types.ObjectId;
}

export const VideoPollsSchema = SchemaFactory.createForClass(VideoPolls);
