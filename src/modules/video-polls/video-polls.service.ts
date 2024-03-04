import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VideoPolls } from './schema/video-polls.schema';
import { Model, Types } from 'mongoose';
import { Video } from '../video/schema/video.schema';
import { VideoPollsDto } from './dto/video-polls.dto';

@Injectable()
export class VideoPollsService {
  constructor(
    @InjectModel(VideoPolls.name)
    private videoPollsModel: Model<VideoPolls>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
  ) {}

  // Get all polls
  async getAllPolls(): Promise<VideoPolls[]> {
    const polls = await this.videoPollsModel.find();
    return polls;
  }

  async createPoll(videoPollsDto: VideoPollsDto): Promise<VideoPolls> {
    const createdPoll = new this.videoPollsModel(videoPollsDto);
    return createdPoll.save();
  }

  async updateVideoWithCreatedPoll(videoId: string, pollId: Types.ObjectId) {
    try {
      // Find the video by its ID
      const videoToUpdate = await this.videoModel.findById(videoId);

      if (!videoToUpdate) {
        // Handle the case where the video is not found
        throw new Error('Video not found');
      }

      // Update the videoPolls array with the new pollId
      videoToUpdate.videoPolls.push(pollId);

      // Save the updated video document
      const updatedVideo = await videoToUpdate.save();

      return updatedVideo;
    } catch (error) {
      // Handle errors (e.g., logging, returning a specific response, etc.)
      throw error;
    }
  }

  async deletePoll(id: string): Promise<void> {
    const poll = await this.videoPollsModel.findByIdAndDelete(id);

    if (!poll) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }
  }

  async deleteVideoPollFromVideo(
    videoId: string,
    pollId: Types.ObjectId,
  ): Promise<Video> {
    const video = await this.videoModel.findById(videoId);

    video.videoPolls.filter((videoPollId) => videoPollId !== pollId);

    video.save();

    return video;
  }
}
