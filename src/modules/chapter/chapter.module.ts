import { Module } from '@nestjs/common';
import { ChapterController } from './controllers/chapter.controller';
import { ChapterService } from './service/chapter.service';
import { Chapter, ChapterSchema } from './schema/chapter.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from '../subject/schema/subject.schema';
import { SubjectService } from '../subject/service/subject.service';
import { Course, CourseSchema } from '../course/schema/course.schema';
import { Topic, TopicSchema } from '../topic/schema/topic.schema';
import { Question, QuestionSchema } from '../question/schema/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [ChapterController],
  providers: [ChapterService,SubjectService],
})
export class ChapterModule {}
