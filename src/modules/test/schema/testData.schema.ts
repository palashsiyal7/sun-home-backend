import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class TestData {
  @Prop({ ref: 'TestDetail' })
  testId: Types.ObjectId;

  @Prop()
  completedTime: string;

  @Prop({ ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  timeTaken: string;

  @Prop()
  isCheated: boolean;

  @Prop({})
  queArr: [];

  @Prop({ required: false })
  Marks?: any[];

  @Prop({ required: false })
  queAnalytics?: any[];

  @Prop()
  percentile: string;

  @Prop()
  globalPercentile: string;

  @Prop({ required: false })
  AreaOfImprovement?: any[];
}

export const TestDataSchema = SchemaFactory.createForClass(TestData);
