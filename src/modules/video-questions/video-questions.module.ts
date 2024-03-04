import { Module } from '@nestjs/common';
import { VideoQuestionsController } from './video-questions.controller';
import { VideoQuestionsService } from './video-questions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoQuestionsSchema } from './schema/video-questions.schema';
import { VideoSchema } from '../video/schema/video.schema';
import { UserSchema } from '../user/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'VideoQuestions', schema: VideoQuestionsSchema}]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Video', schema: VideoSchema }]),
  ],
  controllers: [VideoQuestionsController],
  providers: [VideoQuestionsService]
})
export class VideoQuestionsModule {}
