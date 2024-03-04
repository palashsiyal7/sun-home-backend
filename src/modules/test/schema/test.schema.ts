import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class TestDetail {
  @Prop()
  testTitle: string;

  @Prop()
  description: string;

  @Prop()
  duration: string;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  attemptCount: number;

  @Prop()
  correctMarks: number;

  @Prop()
  inCorrectMarks: number;

  @Prop()
  instructions: string;

  @Prop({ type: [Types.ObjectId], ref: 'Subject' })
  subjects: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Chapter' })
  chapters: Types.ObjectId[];

  @Prop()
  queArr: [];

  // @Prop({ type: [Types.ObjectId], ref: 'User' })
  // users: Types.ObjectId[];

  @Prop(
    raw([
      {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        isCheated: { type: Boolean, default: false },
        Marks: { type: String },
      },
    ]),
  )
  users: {
    userId: Types.ObjectId;
    isCheated: boolean;
    Marks: string;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'Course' })
  course: Types.ObjectId;

  @Prop()
  isSurprise: boolean;

  @Prop()
  isCustom: boolean;

  @Prop()
  totalNoOfQues: number;

  @Prop()
  learderBoard: any [];
}

export const testDetailSchema = SchemaFactory.createForClass(TestDetail);
