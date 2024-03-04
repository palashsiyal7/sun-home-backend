import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Types } from 'mongoose';
import { Chapter } from 'src/modules/chapter/schema/chapter.schema';
import { Course } from 'src/modules/course/schema/course.schema';
import { Subject } from 'src/modules/subject/schema/subject.schema';
import { Teacher } from 'src/modules/teacher/schema/teacher.schema';
import { Topic } from 'src/modules/topic/schema/topic.schema';
import { User } from 'src/modules/user/schema/user.schema';

@Schema({
  timestamps: true,
})
export class Video {
  @ApiProperty()
  @Prop({ required: false })
  videoURL: string;

  @ApiProperty()
  @Prop({ required: false })
  streamingURL: string;

  @ApiProperty()
  @Prop({ required: false })
  playbackURL: string;

  @ApiProperty()
  @Prop({ required: false })
  thumbnailURL: string;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true })
  teacher: User;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' ,required: true })
  course: Course;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' ,required: true })
  subject: Subject;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' ,required: true })
  chapter: Chapter;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' ,required: true })
  topic: Topic;

  @ApiProperty({
    type: [String],
    description: 'Array of questions asked by students',
  })
  @Prop({ type: [Types.ObjectId], ref: 'VideoQuestions' })
  videoQuestions: Types.ObjectId[]; 

  @ApiProperty({
    type: [String],
    description: 'Array of polls to display during streaming',
  })
  @Prop({ type: [Types.ObjectId], ref: 'VideoPolls' })
  videoPolls: Types.ObjectId[]; 

  @ApiProperty()
  @Prop({ required: false })
  publishDate: string;

  @ApiProperty()
  @Prop({ required: false })
  startTime: string;

  @ApiProperty()
  @Prop({ required: false })
  endTime: string;

  @ApiProperty()
  @Prop({ required: true, default: true })
  isLatest: boolean;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
