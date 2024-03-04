import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class QuestionDetail {
  @Prop({ required: true })
  totalQues: number;

  @Prop({ required: true })
  freeQues: number;

}

export const QuestionDetailSchema = SchemaFactory.createForClass(QuestionDetail);
