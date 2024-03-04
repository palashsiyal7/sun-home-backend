import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CourseService } from '../service/course.service';
import { Course } from '../schema/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

@Controller()
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  async findAll(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Course[];
  }> {
    const courses = await this.courseService.findAll();
    return {
      success: true,
      status_code: 200,
      message: 'Courses retrieved successfully',
      data: courses,
    };
  }

  @Get('/enabledTrue')
  async findAllTrue(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Course[];
  }> {
    try {
      const courses = await this.courseService.findAllTrue();
      if (courses.length === 0) {
        throw new Error('Courses are not added');
      }
      return {
        success: true,
        status_code: 200,
        message: 'Courses retrieved successfully',
        data: courses,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: false,
        status_code: 400, // Internal Server Error
        message: errorMessage,
        data: null,
      };
    }
  }

  @Get(':id')
  async getCourseById(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: any;
  }> {
    const course = await this.courseService.findById(id);
    return {
      success: true,
      status_code: 200,
      message: 'Courses retrieved successfully',
      data: course,
    };
  }

  @Get('details/:id')
  async findAllDetailsByCourseId(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: any;
  }> {
    const course = await this.courseService.findAllDetailsByCourseId(id);
    return {
      success: true,
      status_code: 200,
      message: 'Course Detail retrieved successfully',
      data: course,
    };
  }

  @Post('/all-course-details')
  async findAllCourseDetailsByUserId(
    @Body()
    queData: {
      userId: string;
      courseId: string;
    },
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: any[];
  }> {
    try {
      const course = await this.courseService.findAllCourseDetailsByUserId(queData);
      return {
        success: true,
        status_code: 200,
        message: 'Course Details retrieved successfully',
        data: course,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: false,
        status_code: 400, // Internal Server Error
        message: errorMessage,
        data: null,
      };
    }
  }

  @Post()
  async create(
    @Body() courseData: CreateCourseDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.courseService.create(courseData);
    return {
      success: true,
      status_code: 200,
      message: 'course added successfully',
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() courseData: UpdateCourseDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const updatedCourse = await this.courseService.update(id, courseData);
    if (updatedCourse) {
      return {
        success: true,
        status_code: 200,
        message: 'Course updated successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Course not found',
      };
    }
  }

  @Delete(':id')
  async deleteCourse(
    @Param('id') id: string,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const deletedCourse = await this.courseService.delete(id);
    if (deletedCourse) {
      return {
        success: true,
        status_code: 200,
        message: 'Course deleted successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Course not found',
      };
    }
  }

  @Post(':courseId/purchase')
  async purchaseCourse(
    @Param('courseId') courseId: string,
    @Body('userId') userId: string,
    @Body('discountCode') discountCode?: string, // Optional discount code
  ) {
    return this.courseService.purchaseCourse(courseId, userId, discountCode);
  }
}
