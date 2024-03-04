import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Types } from 'mongoose';
import { Course } from 'src/modules/course/schema/course.schema';
import { Subject } from 'src/modules/subject/schema/subject.schema';
import { Video } from 'src/modules/video/schema/video.schema';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Schema({
  timestamps: true,
})
export class Teacher {
  @Prop()
  teacherName: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }] })
  subjects: Subject[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
  courses: Course[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }] })
  videos: Video[];

  // @Prop({ default: false })
  // isFavorite: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ unique: true })
  phoneNumber: number;

  @Prop({ unique: true })
  email: string;

  @Prop({ enum: Gender })
  gender: string;

  @Prop()
  userType: number;

  @Prop({ match: /^[a-zA-Z0-9]{6}$/ }) // Alphanumeric with 6 characters
  refCode: string;

  @ApiProperty()
  @Prop()
  referral: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
