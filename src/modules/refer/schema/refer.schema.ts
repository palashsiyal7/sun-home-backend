import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Refer {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  roleId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: 0 }) // Set a default value for defaultPoints
  defaultPoints: number;

  @Prop({ required: true, default: 0 }) // Set a default value for subscriptionPoints
  subscriptionPoints: number;
}

export type ReferDocument = Refer & Document;

export const ReferSchema = SchemaFactory.createForClass(Refer);
