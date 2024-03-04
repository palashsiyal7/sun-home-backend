import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class TransactionHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId; // User who owns the refCode

  @Prop()
  userName: string; // User's name

  @Prop()
  refCode: string; // User's referral code

  @Prop()
  defaultPoints: number; // Points awarded for the transaction

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  referredUsers: Types.ObjectId[]; // Array of Users who used the refCode

  @Prop()
  totalWalletPoints: number; // Total wallet points after the transaction
}

export const TransactionHistorySchema =
  SchemaFactory.createForClass(TransactionHistory);
