import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Subject {
  @Prop()
  subjectName: string;

  @Prop()
  isActive: boolean;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
