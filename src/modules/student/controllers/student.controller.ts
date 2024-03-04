import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { StudentService } from '../service/student.service';
import { Student } from '../schema/student.schema';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';

@Controller()
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post()
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.studentService.createStudent(createStudentDto);
    return {
      success: true,
      status_code: 200,
      message: 'Student added successfully',
    };
  }

  @Get()
  async getAllStudents(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Student[];
  }> {
    const students = await this.studentService.getAllStudents();
    return {
      success: true,
      status_code: 200,
      message: 'Students retrieved successfully',
      data: students,
    };
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Student;
  }> {
    const student = await this.studentService.getStudentById(id);
    if (!student) {
      return {
        success: false,
        status_code: 404,
        message: 'Student not found',
        data: null,
      };
    }
    return {
      success: true,
      status_code: 200,
      message: 'Student retrieved successfully',
      data: student,
    };
  }

  @Put(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const updatedStudent = await this.studentService.updateStudent(
      id,
      updateStudentDto,
    );
    if (updatedStudent) {
      return {
        success: true,
        status_code: 200,
        message: 'Student updated successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Student not found or update failed',
      };
    }
  }

  @Delete(':id')
  async deleteStudent(
    @Param('id') id: string,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const deleteResult = await this.studentService.deleteStudent(id);
    if (deleteResult) {
      return {
        success: true,
        status_code: 200,
        message: 'Student deleted successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Student not found or deletion failed',
      };
    }
  }

  @Post('register')
  async createOrUpdateStudent(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    try {
      const createdOrUpdatedStudent =
        await this.studentService.createOrUpdateStudent(createStudentDto);
      console.log(createdOrUpdatedStudent);
      return {
        success: true,
        status_code: 200,
        message: 'Student created/updated successfully',
      };
    } catch (error) {
      console.error('An error occurred while processing the request:', error);

      return {
        success: false,
        status_code: 500,
        message: 'Internal server error',
      };
    }
  }

  private generateRandomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const codeLength = 6;

    for (let i = 0; i < codeLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }
}
