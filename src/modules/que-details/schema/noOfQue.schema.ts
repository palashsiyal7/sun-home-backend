import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class NoOfQue {
  @Prop()
  noOfQue: number;
  @Prop()
  isActive: boolean;
}

export const NoOfQueSchema = SchemaFactory.createForClass(NoOfQue);