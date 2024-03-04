import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Discount extends Document {
  @Prop({ required: true, unique: true })
  code: string; // Auto-generative 6-digit alphanumeric code

  @Prop({ required: true })
  title: string; // Coupon title

  @Prop({ required: true })
  validFrom: Date; // Validity start date

  @Prop({ required: true })
  validTo: Date; // Validity end date

  @Prop({ required: true })
  percent: number; // Discount percentage

  @Prop({ required: true })
  maxAmount: number; // Maximum discount amount

  @Prop() // Optional, for flat discount
  flatAmount?: number;

  @Prop({ required: true })
  redemptionLimit: number;

  @Prop({ default: 0 })
  redemptionCount: number;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
