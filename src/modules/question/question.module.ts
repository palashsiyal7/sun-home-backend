import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schema/question.schema';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './service/question.service';
import { Topic, TopicSchema } from '../topic/schema/topic.schema';
import { Practice, PracticeSchema } from '../practice/schema/practice.schema';
import { Subject, SubjectSchema } from '../subject/schema/subject.schema';
import { Chapter, ChapterSchema } from '../chapter/schema/chapter.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { PracticeDetails, PracticeDetailsSchema } from '../practice/schema/practiceDetails.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]), 
    MongooseModule.forFeature([{ name: PracticeDetails.name, schema: PracticeDetailsSchema }]), 
    MongooseModule.forFeature([{ name: Practice.name, schema: PracticeSchema }]), 
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]), 
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]), 
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}

