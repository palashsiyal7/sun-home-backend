import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Schema()
export class Student {
  @Prop()
  studentName: string;

  @Prop({ unique: true })
  phoneNumber: number;

  @Prop({ unique: true })
  email: string;

  @Prop()
  dob: Date;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop({ enum: ['male', 'female', 'other'] })
  gender: Gender;

  @Prop({ type: [Types.ObjectId], ref: 'Course' })
  courses: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  userType: number; // Added userType field

  @Prop({ match: /^[a-zA-Z0-9]{6}$/ }) // Alphanumeric with 6 characters
  refCode: string; // Added refCode field
}

export const StudentSchema = SchemaFactory.createForClass(Student);
