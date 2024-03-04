import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Chapter } from '../schema/chapter.schema';
import { CreateChapterDto } from '../dto/create-chapter.dto';
import { UpdateChapterDto } from '../dto/update-chapter.dto';
import { ChapterService } from '../service/chapter.service';
import { Subject } from 'src/modules/subject/schema/subject.schema';
import { SubjectService } from 'src/modules/subject/service/subject.service';
import { Course } from 'src/modules/course/schema/course.schema';

@Controller()
export class ChapterController {
  constructor(
    private readonly chaptersService: ChapterService,
    private readonly subjectService: SubjectService,
  ) {}

  @Get()
  async findAll(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Chapter[];
  }> {
    const allChapters = await this.chaptersService.findAll();
    return {
      success: true,
      status_code: 200,
      message: 'Chapters retrieved successfully',
      data: allChapters,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Chapter;
  }> {
    const chapter = await this.chaptersService.findById(id);
    return {
      success: true,
      status_code: 200,
      message: 'Chapter retrieved successfully',
      data: chapter,
    };
  }

  @Get(':id/topics')
  async getAllChapters(@Param('id') id: string) {
    return this.chaptersService.getAllTopic(id);
  }

  @Post()
  async create(
    @Body() chapterData: CreateChapterDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.chaptersService.create(chapterData);
    return {
      success: true,
      status_code: 200,
      message: 'chapter added successfully',
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() chapterData: UpdateChapterDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const updatedChapter = await this.chaptersService.update(id, chapterData);
    if (updatedChapter) {
      return {
        success: true,
        status_code: 200,
        message: 'Chapter updated successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Chapter not found',
      };
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const deletedChapter = await this.chaptersService.delete(id);
    if (deletedChapter) {
      return {
        success: true,
        status_code: 200,
        message: 'Chapter deleted successfully',
      };
    } else {
      return {
        success: false,
        status_code: 400,
        message: 'Chapter not found',
      };
    }
  }
}
