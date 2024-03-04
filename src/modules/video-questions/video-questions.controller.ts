import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { VideoQuestionsService } from './video-questions.service';
import { VideoQuestionsDto } from './dto/video-questions.dto';
import { AnswerQuestionDto } from './dto/answerQuestion.dto';

@Controller()
export class VideoQuestionsController {
  constructor(private videoQuestionService: VideoQuestionsService) {}

  // Get all questions
  @Get()
  async getAllQuestions() {
    const questions = await this.videoQuestionService.getAllQuestions();
    return questions;
  }

  // Create new-question
  @Post('/add-question')
  async createQuestion(
    @Body(ValidationPipe) videoQuestionsDto: VideoQuestionsDto,
  ) {
    // create question
    const createdQue =
      await this.videoQuestionService.addQuestions(videoQuestionsDto);

    // Update video's question array with created question
    const updatedVideoWithQue =
      await this.videoQuestionService.updateVideoWithQue(
        createdQue.lecture,
        //@ts-ignore
        createdQue._id,
      );

    return {
      createdQue,
      updatedVideoWithQue,
    };
  }

  // Add answer to existiong question
  @Post('/answer-question')
  async answerExistingQuestion(
    @Body(ValidationPipe) answerQuestionDto: AnswerQuestionDto,
  ) {
    const question =
      await this.videoQuestionService.updateQuestionWithAnswer(
        answerQuestionDto,
      );
    return question;
  }
}
