import { Module } from '@nestjs/common';
import { Practice, PracticeSchema } from './schema/practice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PracticeService } from './service/practice.service';
import { PracticeController } from './controllers/practice.controller';
import { PracticeDetails, PracticeDetailsSchema } from './schema/practiceDetails.schema';
import { Question, QuestionSchema } from '../question/schema/question.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Practice.name, schema: PracticeSchema }]),
      MongooseModule.forFeature([{ name: PracticeDetails.name, schema: PracticeDetailsSchema }]),
      MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    ],
    controllers: [PracticeController],
    providers: [PracticeService],
  })
export class PracticeModule {}
