import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Practice {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Question' })
  queArr: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Chapter' })
  chapters: Types.ObjectId[];

  @Prop()
  isCustom: boolean;
}

export const PracticeSchema = SchemaFactory.createForClass(Practice);
