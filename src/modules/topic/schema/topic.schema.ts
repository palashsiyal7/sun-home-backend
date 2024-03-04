import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Types } from 'mongoose';

@Schema()
export class Topic {
  @Prop()
  topicName: string;

  @Prop()
  topicNo:number;

  @Prop({ type: Types.ObjectId, ref: 'Chapter' })
  chapter: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subject' })
  subject: Types.ObjectId;

  @Prop()
  isActive: boolean;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);