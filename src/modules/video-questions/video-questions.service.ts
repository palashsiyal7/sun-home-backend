import { Injectable } from '@nestjs/common';
import { VideoQuestions } from './schema/video-questions.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { VideoQuestionsDto } from './dto/video-questions.dto';
import { Video } from '../video/schema/video.schema';
import { Question } from '../question/schema/question.schema';
import { AnswerQuestionDto } from './dto/answerQuestion.dto';

@Injectable()
export class VideoQuestionsService {
  constructor(
    @InjectModel(VideoQuestions.name)
    private videoQuestionsModel: Model<VideoQuestions>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
  ) {}

  // Get all questions
  async getAllQuestions(): Promise<VideoQuestions[]> {
    const questions = await this.videoQuestionsModel.find();
    return questions;
  }

  // Create questions
  async addQuestions(
    videoQuestionsDto: VideoQuestionsDto,
  ): Promise<VideoQuestions> {
    const createdQuestion = new this.videoQuestionsModel({
      question: videoQuestionsDto.question,
      student: videoQuestionsDto.student,
      teacher: videoQuestionsDto.teacher,
      lecture: videoQuestionsDto.lecture,
    });
    createdQuestion.save();

    return createdQuestion;
  }

  // Update question (add answers)
  async updateQuestionWithAnswer(
    answerQuestionDto: AnswerQuestionDto,
  ): Promise<VideoQuestions> {
    const updatedQuestion = await this.videoQuestionsModel.findByIdAndUpdate(
      answerQuestionDto.questionId,
      {
        $set: {
          answer: answerQuestionDto.answer,
        },
      },
      {
        new: true,
      },
    );
    return updatedQuestion;
  }

  // Update video que-array with Que
  async updateVideoWithQue(
    videoId: Types.ObjectId,
    queId: Types.ObjectId,
  ): Promise<Video> {
    const video = await this.videoModel.findById(videoId);
    video.videoQuestions.push(queId);
    const updatedVideo = await video.save();
    return updatedVideo;
  }
}
