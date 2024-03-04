import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TopicService } from '../service/topic.service';
import { Topic } from '../schema/topic.schema';
import { CreateTopicDto } from '../dto/create-topic';
import { UpdateTopicDto } from '../dto/update-topic';
import { SubjectService } from 'src/modules/subject/service/subject.service';

@Controller()
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly subjectService: SubjectService,
  ) {}

  @Get()
  async findAll(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Topic[];
  }> {
    const allTopics = await this.topicService.findAll();
    return {
      success: true,
      status_code: 200,
      message: 'Topics retrieved successfully',
      data: allTopics,
    };
  }

 
  @Get(':id')
  async findById(@Param('id') id: string): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Topic;
  }> {
    const topic = await this.topicService.findById(id);
    return {
      success: true,
      status_code: 200,
      message: 'Topic retrieved successfully',
      data: topic,
    };
  }

  @Post()
  async create(
    @Body() topicData: CreateTopicDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.topicService.create(topicData);
    return {
      success: true,
      status_code: 200,
      message: 'topic added successfully',
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() topicData: UpdateTopicDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const updatedTopic = await this.topicService.update(id, topicData);
    if (updatedTopic) {
      return {
        success: true,
        status_code: 200,
        message: 'Topic updated successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Topic not found',
      };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean; status_code: number; message: string }> {
    const deletedTopic=await this.topicService.delete(id);
    if (deletedTopic) {
      return {
        success: true,
        status_code: 200,
        message: 'Topic deleted successfully',
      };
    } else {
      return {
        success: false,
        status_code: 400,
        message: 'Topic not found',
      };
    }
  }
}
