import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Attendance {
  @ApiProperty({ type: [String], isArray: true })
  @Prop({ required: false })
  student: string[];

  @ApiProperty({ type: Types.ObjectId, description: 'Course' })
  @Prop({ type: Types.ObjectId, ref: 'Course' })
  course: Types.ObjectId;

  @ApiProperty({ type: Types.ObjectId, description: 'Video' })
  @Prop({ type: Types.ObjectId, ref: 'Video' })
  lecture: Types.ObjectId;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
