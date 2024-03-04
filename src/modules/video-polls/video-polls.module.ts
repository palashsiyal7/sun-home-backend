import { Module } from '@nestjs/common';
import { VideoPollsController } from './video-polls.controller';
import { VideoPollsService } from './video-polls.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoPollsSchema } from './schema/video-polls.schema';
import { VideoSchema } from '../video/schema/video.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'VideoPolls', schema: VideoPollsSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Video', schema: VideoSchema }]),
  ],
  controllers: [VideoPollsController],
  providers: [VideoPollsService],
})
export class VideoPollsModule {}
