import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Question } from '../schema/question.schema';
import { QuestionService } from '../service/question.service';
import { CreateQueDto } from '../dto/create-que.dto';
import { Practice } from 'src/modules/practice/schema/practice.schema';

@Controller('')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Get()
  async findAll(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Question[];
  }> {
    const questions = await this.questionService.findAll();
    return {
      success: true,
      status_code: 200,
      message: 'Questions retrieved successfully',
      data: questions,
    };
  }

  @Get(':id')
  async getQueById(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Question;
  }> {
    const question = await this.questionService.findById(id);
    return {
      success: true,
      status_code: 200,
      message: 'Question retrieved successfully',
      data: question,
    };
  }

  @Get('/file/:id')
  async getQueByFileId(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Question[];
  }> {
    const question = await this.questionService.findQueByFileId(id);
    return {
      success: true,
      status_code: 200,
      message: 'Question retrieved successfully',
      data: question,
    };
  }

  @Get('/subject/:id')
  async getQueBySubjectId(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Question[];
  }> {
    const question = await this.questionService.findQueBySubjectId(id);
    return {
      success: true,
      status_code: 200,
      message: 'Question retrieved successfully',
      data: question,
    };
  }

  @Get('/chapter/:id')
  async getQueByChapterId(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Question[];
  }> {
    const question = await this.questionService.findQueByChapterId(id);
    return {
      success: true,
      status_code: 200,
      message: 'Question retrieved successfully',
      data: question,
    };
  }

  @Get('/topic/:id')
  async getQueByTopicId(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Question[];
  }> {
    const question = await this.questionService.findQueByTopicId(id);
    return {
      success: true,
      status_code: 200,
      message: 'Question retrieved successfully',
      data: question,
    };
  }

  @Post('/practice')
  async findRandomQueByChapterId(
    @Body()
    queData: {
      chapterId: string;
      userId: string;
    },
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Practice;
  }> {
    try {
      const question =
        await this.questionService.findRandomQueByChapterId(queData);
      if (question.queArr.length === 0) {
        return {
          success: true,
          status_code: 404, // status code for "Not Found"
          message: 'Questions not added for the given topic ID',
          data: null,
        };
      }
      return {
        success: true,
        status_code: 200,
        message: 'Question retrieved successfully',
        data: question,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: true,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }

  @Post()
  async create(
    @Body() queData: CreateQueDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.questionService.create(queData);
    return {
      success: true,
      status_code: 200,
      message: 'question added successfully',
    };
  }

  @Post('/custompractice')
  async customPratice(
    @Body()
    queData: {
      userId: string;
      chapters: string[];
      level: string;
      typeOfQue: string[];
      noOfQue: number;
      timing: string;
    },
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Practice;
  }> {
    try {
      const question = await this.questionService.customPratice(queData);
      if (question.queArr.length === 0) {
        return {
          success: true,
          status_code: 404, // status code for "Not Found"
          message: 'Questions not added for the given Chapter',
          data: null,
        };
      }
      return {
        success: true,
        status_code: 200,
        message: 'Question retrieved successfully',
        data: question,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: true,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }
}
