import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from '../schema/student.schema';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Teacher } from 'src/modules/teacher/schema/teacher.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = new this.studentModel(createStudentDto);

    return student.save();
  }

  async getAllStudents(): Promise<Student[]> {
    return this.studentModel.find().populate('courses').exec();
  }

  async getStudentById(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    return student;
  }

  async updateStudent(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student | null> {
    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, updateStudentDto, { new: true })
      .exec();
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<boolean> {
    try {
      const deleteResult = await this.studentModel.findByIdAndRemove(id).exec();
      return !!deleteResult;
    } catch (error) {
      console.error('An error occurred while deleting the student:', error);
      return false;
    }
  }

  async createStudentWithBlankFields(
    createStudentDto: Pick<CreateStudentDto, 'studentName' | 'phoneNumber'>,
  ): Promise<Student> {
    const { studentName, phoneNumber } = createStudentDto;

    const student = new this.studentModel({
      studentName,
      phoneNumber,
      email: '',
      dob: null,
      city: '',
      state: '',
      gender: 'other',
      courses: [],
      isActive: false,
    });

    return student.save();
  }

  async updateStudentWithCompleteInfo(
    phoneNumber: number,
    updateStudentDto: CreateStudentDto,
  ): Promise<Student> {
    const existingStudent = await this.studentModel.findOne({ phoneNumber });

    if (existingStudent) {
      existingStudent.set(updateStudentDto);
      return existingStudent.save();
    } else {
      throw new Error('Student not found for update');
    }
  }

  // async createOrUpdateStudent(
  //   createStudentDto: CreateStudentDto,
  // ): Promise<Student> {
  //   const { status, phoneNumber } = createStudentDto;

  //   if (status === 0) {
  //     return this.createStudentWithBlankFields({
  //       studentName: createStudentDto.studentName,
  //       phoneNumber,
  //     });
  //   } else if (status === 1) {
  //     return this.updateStudentWithCompleteInfo(phoneNumber, createStudentDto);
  //   } else {
  //     throw new Error('Invalid status value');
  //   }
  // }

  async createOrUpdateStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<Student> {
    const { status, phoneNumber } = createStudentDto;
  
    if (status === 0) {
      // Continue with the existing logic for status 0
      return this.createStudentWithBlankFields({
        studentName: createStudentDto.studentName,
        phoneNumber,
      });
    } else if (status === 1) {
      // Set userType to 1
      createStudentDto.userType = 1;
  
      // Generate a random alphanumeric code
      const refCode = this.generateRandomCode();
  
      // Update the student with complete info and include the refCode
      const updatedStudent = await this.updateStudentWithCompleteInfo(phoneNumber, {
        ...createStudentDto,
        refCode,
      });
  
      return updatedStudent;
    } else {
      throw new Error('Invalid status value');
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
  async getStudentsByRefCode(refCode: string): Promise<Student[]> {
    return this.studentModel.find({ refCode }).select('studentName refCode').exec();
  }
}
