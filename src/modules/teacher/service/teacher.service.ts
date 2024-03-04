import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher } from '../schema/teacher.schema';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
  ) {}

  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const teacher = new this.teacherModel(createTeacherDto);
    return teacher.save();
  }

  async getAllTeachers(): Promise<Teacher[]> {
    return this.teacherModel.find().exec();
    // return this.teacherModel.find().populate('subject').exec();
  }

  async getTeacherById(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new Error('Teacher not found');
    }
    return teacher;
  }

  async updateTeacher(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    const teacher = await this.teacherModel
      .findByIdAndUpdate(id, updateTeacherDto, { new: true })
      .exec();
    if (!teacher) {
      throw new Error('Teacher not found');
    }
    return teacher;
  }

  async deleteTeacher(id: string): Promise<boolean> {
    try {
      const deleteResult = await this.teacherModel.findByIdAndRemove(id).exec();
      return !!deleteResult;
    } catch (error) {
      console.error('An error occurred while deleting the teacher:', error);
      return false;
    }
  }

  async createOrUpdateTeacher(
    createTeacherDto: CreateTeacherDto,
  ): Promise<Teacher> {
    const { phoneNumber } = createTeacherDto;

    const existingTeacher = await this.teacherModel.findOne({ phoneNumber });

    if (existingTeacher) {
      existingTeacher.set(createTeacherDto);
      return existingTeacher.save();
    } else {
      // If the teacher does not exist, create a new one
      return this.createTeacher(createTeacherDto);
    }
  }
  async getTeachersByRefCode(refCode: string): Promise<Teacher[]> {
    return this.teacherModel.find({ refCode }).select('teacherName refCode').exec();
  }
}
