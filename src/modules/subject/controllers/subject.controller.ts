import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SubjectService } from '../service/subject.service';
import { Subject } from '../schema/subject.schema';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';

@Controller()
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  async findAll(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Subject[];
  }> {
    const allSubjects = await this.subjectService.findAll();
    return {
      success: true,
      status_code: 200,
      message: 'Subjects retrieved successfully',
      data: allSubjects,
    };
  }

  @Get('/all')
  async findAllDetails(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Subject[];
  }> {
    const allSubjects = await this.subjectService.findAllDetails();
    return {
      success: true,
      status_code: 200,
      message: 'Subjects retrieved successfully',
      data: allSubjects,
    };
  }

  @Get('/enabledTrue')
  async findAllTrue(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Subject[];
  }> {
    const allSubjects = await this.subjectService.findAllTrue();
    return {
      success: true,
      status_code: 200,
      message: 'Subjects retrieved successfully',
      data: allSubjects,
    };
  }

  @Get(':id')
  async getSubjectById(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Subject;
  }> {
    const subject = await this.subjectService.findById(id);
    return {
      success: true,
      status_code: 200,
      message: 'Subject retrieved successfully',
      data: subject,
    };
  }

  @Get('/:id/chapterInfo')
  async getChaptersOfSubject(@Param('id') id: string) {
    return await this.subjectService.getAllChapters(id);
  }

  @Post()
  async create(
    @Body() subjectData: CreateSubjectDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.subjectService.create(subjectData);
    return {
      success: true,
      status_code: 200,
      message: 'subject added successfully',
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() subjectData: UpdateSubjectDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const updatedSubject = await this.subjectService.update(id, subjectData);
    if (updatedSubject) {
      return {
        success: true,
        status_code: 200,
        message: 'Subject updated successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Subject not found',
      };
    }
  }

  @Delete(':id')
  async deleteSubject(
    @Param('id') id: string,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const deletedSubject = await this.subjectService.delete(id);
    if (deletedSubject) {
      return {
        success: true,
        status_code: 200,
        message: 'Subject deleted successfully',
      };
    } else {
      return {
        success: false,
        status_code: 400,
        message: 'Subject not found',
      };
    }
  }
}
