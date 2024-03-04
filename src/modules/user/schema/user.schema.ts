import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  EMPTY = '',
}

@Schema({
  timestamps: true,
})
export class User extends Document {
  @ApiProperty()
  @Prop()
  userName: string;

  @ApiProperty({ uniqueItems: true })
  @Prop({ unique: true, required: true })
  phoneNumber: number;

  @ApiProperty({ uniqueItems: true })
  @Prop({ unique: true })
  email: string;

  @ApiProperty({})
  @Prop()
  dob: string;

  @ApiProperty()
  @Prop()
  city: string;

  @ApiProperty()
  @Prop()
  state: string;

  @ApiProperty({ enum: Gender, enumName: 'Gender' })
  @Prop({ enum: Gender })
  gender: string;

  @ApiProperty()
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Prop()
  userType: number;

  @ApiProperty({ pattern: '^[a-zA-Z0-9]{6}$' })
  @Prop({ match: /^[a-zA-Z0-9]{6}$/ })
  refCode: string;

  @ApiProperty()
  @Prop()
  referral: string;
  // referrals: string[];

  @ApiProperty()
  @Prop({ default: 0 })
  walletPoint: number;

  @ApiProperty({ type: Types.ObjectId, description: 'Role' })
  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role: Types.ObjectId;

  @ApiProperty({
    type: [String],
    description: 'Array of course _ids for students',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Course' })
  courses: Types.ObjectId[]; // Reference to multiple Course schemas for students

  @ApiProperty({
    type: [String],
    description: 'Array of subject _ids for teachers',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Subject' })
  subjects: Types.ObjectId[]; // Reference to multiple Subject schemas for teachers

  @ApiProperty({
    type: [String],
    description: 'Array of videos _ids for teachers',
  })
  @Prop({ required: false })
  videos: string[];

  @ApiProperty()
  @Prop({ type: String })
  image: string; // Path or URL to the user's image

  @ApiProperty()
  @Prop({ type: String, required: false })
  password: string;

  @ApiProperty()
  @Prop({ default: false })
  isPaid: boolean;

  @ApiProperty({ default: 2 })
  @Prop({ default: 2 })
  count: number;

  @ApiProperty()
  @Prop({ type: String })
  token: string;

  @ApiProperty()
  @Prop({ type: String })
  deviceId: string;

  @ApiProperty()
  @Prop({ default: false })
  isLoggedIn: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
