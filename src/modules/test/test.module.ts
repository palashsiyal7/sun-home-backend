import { Module } from '@nestjs/common';
import { TestController } from './controllers/test.controller';
import { TestService } from './service/test.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../course/schema/course.schema';
import { SubjectSchema } from '../subject/schema/subject.schema';
import { Subject } from 'rxjs';
import { Chapter, ChapterSchema } from '../chapter/schema/chapter.schema';
import { Question, QuestionSchema } from '../question/schema/question.schema';
import { TestDetail, testDetailSchema } from './schema/test.schema';
import { TestData, TestDataSchema } from './schema/testData.schema';
import { User, UserSchema } from '../user/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: TestDetail.name, schema: testDetailSchema },
      { name: TestData.name, schema: TestDataSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
