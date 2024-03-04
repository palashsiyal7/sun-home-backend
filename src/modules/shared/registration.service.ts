import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from '../student/schema/student.schema';
import { Teacher } from '../teacher/schema/teacher.schema';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { CreateTeacherDto } from '../teacher/dto/create-teacher.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
  ) {}

//   async registerUser(body: CreateStudentDto | CreateTeacherDto): Promise<Student | Teacher> {
//     const { status, phoneNumber } = body;

//     if (status === 0) {
//       // Handle student registration with only name and phone number
//       const student = new this.studentModel({
//         studentName: CreateStudentDto.studentName,
//         phoneNumber,
//       });

//       return student.save();
//     } else if (status === 1) {
//       // Handle student registration with userType = 1 and a random alphanumeric 6-digit code in refCode
//       const refCode = this.generateRandomCode();
//       const student = new this.studentModel({
//         studentName: CreateStudentDto.studentName,
//         phoneNumber,
//         userType: 1,
//         refCode,
//       });

//       return student.save();
//     } else if (status === 2) {
//       // Handle teacher registration with userType = 2 and a random alphanumeric 6-digit code in refCode
//       const refCode = this.generateRandomCode();
//       const teacher = new this.teacherModel({
//         teacherName: CreateTeacherDto.teacherName,
//         phoneNumber,
//         userType: 2,
//         refCode,
//       });

//       return teacher.save();
//     } else {
//       throw new Error('Invalid status value');
//     }
//   }

// async registerUser(body: CreateStudentDto | CreateTeacherDto): Promise<Student | Teacher> {
//     const { status, phoneNumber } = body;
  
//     if (status === 0) {
//       // Check if a student with the given phone number already exists
//       const existingStudent = await this.studentModel.findOne({ phoneNumber });
  
//       if (existingStudent) {
//         // Update the existing student with the provided fields
//         existingStudent.set(body);
//         return existingStudent.save();
//       } else {
//         // Create a new student with only name and phone number
//         const student = new this.studentModel({
//           studentName: (body as CreateStudentDto).studentName,
//           phoneNumber,
//         });
  
//         return student.save();
//       }
//     } else if (status === 1) {
//       // Check if a student with the given phone number already exists
//       const existingStudent = await this.studentModel.findOne({ phoneNumber });
  
//       if (existingStudent) {
//         // Update the existing student with the provided fields
//         existingStudent.set(body);
//         return existingStudent.save();
//       } else {
//         // Create a new student with userType = 1 and a random alphanumeric 6-digit code in refCode
//         const refCode = this.generateRandomCode();
//         const student = new this.studentModel({
//           studentName: (body as CreateStudentDto).studentName,
//           phoneNumber,
//           userType: 1,
//           refCode,
//         });
  
//         return student.save();
//       }
//     } else if (status === 2) {
//       // Check if a teacher with the given phone number already exists
//       const existingTeacher = await this.teacherModel.findOne({ phoneNumber });
  
//       if (existingTeacher) {
//         // Update the existing teacher with the provided fields
//         existingTeacher.set(body);
//         return existingTeacher.save();
//       } else {
//         // Create a new teacher with userType = 2 and a random alphanumeric 6-digit code in refCode
//         const refCode = this.generateRandomCode();
//         const teacher = new this.teacherModel({
//           teacherName: (body as CreateTeacherDto).teacherName,
//           phoneNumber,
//           userType: 2,
//           refCode,
//         });
  
//         return teacher.save();
//       }
//     } else {
//       throw new Error('Invalid status value');
//     }
//   }
  
async registerUser(body: CreateStudentDto | CreateTeacherDto): Promise<Student | Teacher> {
  const { status, phoneNumber } = body;

  if (status === 0) {
    // Check if a student with the given phone number already exists
    const existingStudent = await this.studentModel.findOne({ phoneNumber });

    if (existingStudent) {
      // Update the existing student with the provided fields
      existingStudent.set(body);
      return existingStudent.save();
    } else {
      // Create a new student with only name and phone number
      const student = new this.studentModel({
        studentName: (body as CreateStudentDto).studentName,
        phoneNumber,
      });

      return student.save();
    }
  } else if (status === 1) {
    // Check if a student with the given phone number already exists
    const existingStudent = await this.studentModel.findOne({ phoneNumber });

    if (existingStudent) {
      // Update the existing student with the provided fields
      existingStudent.set(body);
      return existingStudent.save();
    } else {
      // Create a new student with userType = 1 and a random alphanumeric 6-digit code in refCode
      const refCode = this.generateRandomCode();
      const student = new this.studentModel({
        // studentName: (body as CreateStudentDto).studentName,
        // phoneNumber,
        ...body, // Set all fields from the incoming body
        userType: 1,
        refCode,
      });

      return student.save();
    }
  } else if (status === 2) {
    // Check if a teacher with the given phone number already exists
    const existingTeacher = await this.teacherModel.findOne({ phoneNumber });

    if (existingTeacher) {
      // Update the existing teacher with the provided fields
      existingTeacher.set(body);
      return existingTeacher.save();
    } else {
      // Create a new teacher with userType = 2 and a random alphanumeric 6-digit code in refCode
      const refCode = this.generateRandomCode();
      const teacher = new this.teacherModel({
        // teacherName: (body as CreateTeacherDto).teacherName,
        // phoneNumber,
        ...body, // Set all fields from the incoming body
        userType: 2,
        refCode,
      });

      return teacher.save();
    }
  } else {
    throw new Error('Invalid status value');
  }
}

  private generateRandomCode(): string {
    // Implement logic to generate a random alphanumeric 6-digit code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
  }

  async getAllUsersWithRefCode(): Promise<{ students: Student[], teachers: Teacher[] }> {
    const students = await this.studentModel.find({ refCode: { $exists: true } }, 'studentName refCode');
    const teachers = await this.teacherModel.find({ refCode: { $exists: true } }, 'teacherName refCode');

    return { students, teachers };
  }
}
