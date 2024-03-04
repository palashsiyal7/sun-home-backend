import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class } from '../schema/class.schema';

@Injectable()
export class ClassService {
  constructor(@InjectModel(Class.name) private classModel: Model<Class>) {}

  async findAll(): Promise<Class[]> {
    return this.classModel.find().exec();
  }

  async findAllTrue(): Promise<Class[]> {
    return this.classModel.find({ isActive: true }).exec();
  }

  async findById(id: string): Promise<Class> {
    const classDetail = await this.classModel.findById(id);
    if (!classDetail) {
      throw new Error('Class not found.');
    }
    return classDetail;
  }

  async create(courseData: Class): Promise<Class> {
    const createdClass = new this.classModel(courseData);
    return createdClass.save();
  }

  async update(id: string, courseData: Class): Promise<Class> {
    return this.classModel
      .findByIdAndUpdate(id, courseData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const deletedClass = await this.classModel.findByIdAndDelete(id).exec();
    return !!deletedClass;
  }
}
