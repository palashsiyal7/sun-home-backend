import { Module } from '@nestjs/common';
import { TopicController } from './controllers/topic.controller';
import { TopicService } from './service/topic.service';
import { Topic, TopicSchema } from './schema/topic.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../course/schema/course.schema';
import { Subject, SubjectSchema } from '../subject/schema/subject.schema';
import { Chapter, ChapterSchema } from '../chapter/schema/chapter.schema';
import { SubjectService } from '../subject/service/subject.service';
import { Question, QuestionSchema } from '../question/schema/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Topic.name, schema: TopicSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [TopicController],
  providers: [TopicService,SubjectService]
})
export class TopicModule {}
