import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadService } from './service/file-upload.service';
import { FileUploadController } from './controllers/file-upload.controller';
import { QuestionService } from '../question/service/question.service';
import { Question, QuestionSchema } from '../question/schema/question.schema';
import { Topic, TopicSchema } from '../topic/schema/topic.schema';
import { FileSchema } from './schema/file-upload.schema';
import { Practice, PracticeSchema } from '../practice/schema/practice.schema';
import { SubjectService } from '../subject/service/subject.service';
import { TopicService } from '../topic/service/topic.service';
import { Subject, SubjectSchema } from '../subject/schema/subject.schema';
import { ChapterService } from '../chapter/service/chapter.service';
import { Chapter, ChapterSchema } from '../chapter/schema/chapter.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { PracticeDetails, PracticeDetailsSchema } from '../practice/schema/practiceDetails.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'File', schema: FileSchema }]),
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]),
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: Practice.name, schema: PracticeSchema }]),
    MongooseModule.forFeature([{ name: PracticeDetails.name, schema: PracticeDetailsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService, QuestionService, SubjectService,TopicService,ChapterService],
})
export class FileUploadModule {}
