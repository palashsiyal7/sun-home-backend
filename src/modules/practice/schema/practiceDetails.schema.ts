import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class PracticeDetails {
  @Prop({ ref: 'Practice' })
  practiceId: Types.ObjectId;

  @Prop({ ref: 'User' })
  userId: Types.ObjectId;

  @Prop({  })
  queArr: [];

  @Prop({ required:false })
  analytics?: [];

  @Prop({ required:false })
  queAnalytics?: any [];
}

export const PracticeDetailsSchema =
  SchemaFactory.createForClass(PracticeDetails);
