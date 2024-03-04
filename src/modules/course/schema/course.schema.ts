import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Course {
  @Prop()
  courseName: string;

  @Prop()
  isActive: boolean;

  @Prop()
  price:number

  @Prop({ type: [Types.ObjectId], ref: 'Subject' })
  subjects: Types.ObjectId[]; 
}

export const CourseSchema = SchemaFactory.createForClass(Course);
