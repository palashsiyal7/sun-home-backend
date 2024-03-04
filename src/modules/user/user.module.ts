import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ReferService } from '../refer/refer.service';
import { Refer, ReferSchema } from '../refer/schema/refer.schema';
import { Role, RoleSchema } from '../role/schema/role.schema';
import {
  TransactionHistory,
  TransactionHistorySchema,
} from '../transaction-history/schema/transaction-history.schema';
import { Subject, SubjectSchema } from '../subject/schema/subject.schema';
import { Chapter, ChapterSchema } from '../chapter/schema/chapter.schema';
import { Topic, TopicSchema } from '../topic/schema/topic.schema';
import { Question, QuestionSchema } from '../question/schema/question.schema';
import { Video, VideoSchema } from '../video/schema/video.schema';
import { Course, CourseSchema } from '../course/schema/course.schema';
import { Practice, PracticeSchema } from '../practice/schema/practice.schema';
import {
  PracticeDetails,
  PracticeDetailsSchema,
} from '../practice/schema/practiceDetails.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Video.name, schema: VideoSchema },
      { name: Course.name, schema: CourseSchema },
      { name: TransactionHistory.name, schema: TransactionHistorySchema },
      { name: Role.name, schema: RoleSchema },
      { name: Refer.name, schema: ReferSchema },
      { name: PracticeDetails.name, schema: PracticeDetailsSchema },
      { name: Practice.name, schema: PracticeSchema },
    ]),
  ],
  providers: [UserService, JwtService, ReferService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
