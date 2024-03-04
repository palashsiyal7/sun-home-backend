import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ClassService } from '../service/class.service';
import { Class } from '../schema/class.schema';
import { UpdateClassDto } from '../dto/update-class.dto';
import { CreateClassDto } from '../dto/create-class.dto';

@Controller()
export class ClassController {
  constructor(private classService: ClassService) {}

  @Get()
  async findAll(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Class[];
  }> {
    try {
      const classes = await this.classService.findAll();
      if (classes.length === 0) {
        throw new Error('Classes are not added');
      }
      return {
        success: true,
        status_code: 200,
        message: 'Classes retrieved successfully',
        data: classes,
      };
    } catch (error) {
      return {
        success: false,
        status_code: 500, // Internal Server Error
        message: 'Internal Server Error',
        data: null,
      };
    }
  }

  @Get('/enabledTrue')
  async findAllTrue(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Class[];
  }> {
    try {
      const classes = await this.classService.findAllTrue();
      if (classes.length === 0) {
        throw new Error('Classes are not added');
      }
      return {
        success: true,
        status_code: 200,
        message: 'Classes retrieved successfully',
        data: classes,
      };
    } catch (error) {
      const errorMessage =
      error instanceof Error ? error.message : 'An error occurred';
        return {
        success: false,
        status_code: 400, 
        message: errorMessage,
        data: null,
      };
    }
  }

  @Get(':id')
  async getClassById(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Class;
  }> {
    const classDetail = await this.classService.findById(id);
    return {
      success: true,
      status_code: 200,
      message: 'Class retrieved successfully',
      data: classDetail,
    };
  }

  @Post()
  async create(
    @Body() courseData: CreateClassDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.classService.create(courseData);
    return {
      success: true,
      status_code: 200,
      message: 'class added successfully',
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() courseData: UpdateClassDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const updatedClass = await this.classService.update(id, courseData);
    if (updatedClass) {
      return {
        success: true,
        status_code: 200,
        message: 'Class updated successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Class not found',
      };
    }
  }

  @Delete(':id')
  async deleteCourse(
    @Param('id') id: string,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const deletedClass = await this.classService.delete(id);
    if (deletedClass) {
      return {
        success: true,
        status_code: 200,
        message: 'Class deleted successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Class not found',
      };
    }
  }
}
