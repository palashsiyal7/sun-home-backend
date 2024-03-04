import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TeacherService } from '../service/teacher.service';
import { Teacher } from '../schema/teacher.schema';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';

@Controller()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  async createTeacher(@Body() createTeacherDto: CreateTeacherDto): Promise<{
    success: boolean;
    status_code: number;
    message: string;
  }> {
    await this.teacherService.createTeacher(createTeacherDto);
    return {
      success: true,
      status_code: 200,
      message: 'Teacher added successfully',
    };
  }

  @Get()
  async getAllTeachers(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Teacher[];
  }> {
    const teachers = await this.teacherService.getAllTeachers();
    return {
      success: true,
      status_code: 200,
      message: 'Teachers retrieved successfully',
      data: teachers,
    };
  }

  @Get(':id')
  async getTeacherById(@Param('id') id: string): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Teacher;
  }> {
    const teacher = await this.teacherService.getTeacherById(id);
    if (!teacher) {
      return {
        success: false,
        status_code: 404,
        message: 'Teacher not found',
        data: null,
      };
    }
    return {
      success: true,
      status_code: 200,
      message: 'Teacher retrieved successfully',
      data: teacher,
    };
  }

  @Put(':id')
  async updateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const updatedTeacher = await this.teacherService.updateTeacher(
      id,
      updateTeacherDto,
    );
    if (updatedTeacher) {
      return {
        success: true,
        status_code: 200,
        message: 'Teacher updated successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Teacher not found',
      };
    }
  }

  @Delete(':id')
  async deleteTeacher(
    @Param('id') id: string,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const deleteResult = await this.teacherService.deleteTeacher(id);
    if (deleteResult) {
      return {
        success: true,
        status_code: 200,
        message: 'Teacher deleted successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Teacher not found or deletion failed',
      };
    }
  }
}
