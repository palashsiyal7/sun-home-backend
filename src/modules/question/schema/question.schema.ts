import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Question {
  @Prop({ required: true })
  question: string;

  @Prop()
  options: [];

  @Prop({ required: true })
  correctAns: string;

  @Prop()
  level: string;

  @Prop()
  avgTime: string;

  @Prop()
  solution: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Topic' })
  topic: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Subject' })
  subject: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Chapter' })
  chapter: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'File' })
  file: Types.ObjectId;

  @Prop()
  attempts:number;

  @Prop()
  correctAttempts:number;

  @Prop()
  gotRight:string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
