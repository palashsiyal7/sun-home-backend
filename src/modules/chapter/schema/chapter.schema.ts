import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Chapter {
  @Prop()
  chapterName: string;

  @Prop()
  chapterNo: number;

  @Prop({ type: Types.ObjectId, ref: 'Subject' })
  subject: Types.ObjectId;

  @Prop()
  isActive: boolean;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
