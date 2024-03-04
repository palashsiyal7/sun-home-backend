import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { CreateTeacherDto } from '../teacher/dto/create-teacher.dto';
import { StudentService } from '../student/service/student.service';
import { TeacherService } from '../teacher/service/teacher.service';
import { Student } from '../student/schema/student.schema';
import { Teacher } from '../teacher/schema/teacher.schema';

@Controller()
export class RegistrationController {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly studentService: StudentService,
    private readonly teacherService: TeacherService,
  ) {}

  @Post()
  async registerUser(@Body() body: CreateStudentDto | CreateTeacherDto) {
    const result = await this.registrationService.registerUser(body);
    return {
      success: true,
      status_code: 200,
      message: 'User registered successfully',
      data: result,
    };
  }

  @Get()
  async getAllUsersWithRefCode(): Promise<{ students: Student[], teachers: Teacher[] }> {
    try {
      const usersWithRefCode = await this.registrationService.getAllUsersWithRefCode();
      return usersWithRefCode;
    } catch (error) {
      // Handle errors appropriately
      console.error(error);
      throw new Error('Failed to fetch users with refCode');
    }
  }
}
