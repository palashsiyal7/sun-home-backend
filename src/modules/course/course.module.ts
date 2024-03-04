import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseService } from './service/course.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schema/course.schema';
import { Subject, SubjectSchema } from '../subject/schema/subject.schema';
import { Topic, TopicSchema } from '../topic/schema/topic.schema';
import { Chapter, ChapterSchema } from '../chapter/schema/chapter.schema';
import {
  QuestionDetail,
  QuestionDetailSchema,
} from '../question/schema/queDetail.schema';
import { Question, QuestionSchema } from '../question/schema/question.schema';
import { Practice, PracticeSchema } from '../practice/schema/practice.schema';
import {
  PracticeDetails,
  PracticeDetailsSchema,
} from '../practice/schema/practiceDetails.schema';
import { Discount, DiscountSchema } from '../discounts/discounts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]),
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    MongooseModule.forFeature([
      { name: QuestionDetail.name, schema: QuestionDetailSchema },
    ]),
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    MongooseModule.forFeature([
      { name: Practice.name, schema: PracticeSchema },
    ]),
    MongooseModule.forFeature([
      { name: PracticeDetails.name, schema: PracticeDetailsSchema },
    ]),
    MongooseModule.forFeature([
      { name: Discount.name, schema: DiscountSchema },
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
