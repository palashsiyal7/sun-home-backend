import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { VideoPollsService } from './video-polls.service';
import { VideoPollsDto } from './dto/video-polls.dto';

@Controller()
export class VideoPollsController {
  constructor(private videoPollsService: VideoPollsService) {}

  @Get()
  async getAllVideoPolls() {
    const polls = await this.videoPollsService.getAllPolls();
    return polls;
  }

  @Post('addPoll')
  async createPoll(@Body(ValidationPipe) videoPollsDto: VideoPollsDto) {
    const createdPoll = await this.videoPollsService.createPoll(videoPollsDto);

    const updatedVideo =
      await this.videoPollsService.updateVideoWithCreatedPoll(
        videoPollsDto.lecture,
        //@ts-ignore
        createdPoll._id,
      );

    return {
      message: 'Poll created successfully',
      data: {
        createdPoll,
        updatedVideo,
      },
    };
  }

  @Delete('deletePoll/:videoId/:pollId')
  @HttpCode(204)
  async deletePoll(
    @Param('pollId') pollId: string,
    @Param('videoId') videoId: string
    ): Promise<void> {
    await this.videoPollsService.deletePoll(pollId);
  }
}
