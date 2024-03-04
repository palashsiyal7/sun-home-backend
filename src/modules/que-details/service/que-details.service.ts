import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NoOfQue } from '../schema/noOfQue.schema';
import { Model } from 'mongoose';
import { TypeOfQue } from '../schema/typeOfQue.schema';

@Injectable()
export class QueDetailsService {
  constructor(
    @InjectModel(NoOfQue.name) private noOfQueModel: Model<NoOfQue>,
    @InjectModel(TypeOfQue.name) private typeOfQueModel: Model<TypeOfQue>,
  ) {}

  async findAllDetails(): Promise<{
    noOfQues: NoOfQue[];
    typeOfQues: TypeOfQue[];
  }> {
    const noOfQuePromise = this.noOfQueModel.find().exec();
    const typeOfQuePromise = this.typeOfQueModel.find().exec();
    const [noOfQue, typeOfQue] = await Promise.all([
      noOfQuePromise,
      typeOfQuePromise,
    ]);

    return { noOfQues: noOfQue, typeOfQues: typeOfQue };
  }

  async findAllTrueTypes(): Promise<{}> {
    const typeOfQuePromise = this.typeOfQueModel
      .find({ isActive: true })
      .exec();
    const [typeOfQue] = await Promise.all([typeOfQuePromise]);

    return { typeOfQues: typeOfQue };
  }

  async findAllTrue(): Promise<{
    noOfQues: NoOfQue[];
    typeOfQues: TypeOfQue[];
  }> {
    const noOfQuePromise = this.noOfQueModel.find({ isActive: true }).exec();
    const typeOfQuePromise = this.typeOfQueModel
      .find({ isActive: true })
      .exec();
    const [noOfQue, typeOfQue] = await Promise.all([
      noOfQuePromise,
      typeOfQuePromise,
    ]);

    return { noOfQues: noOfQue, typeOfQues: typeOfQue };
  }

  async createNoOfQue(noOfQueData: NoOfQue): Promise<NoOfQue> {
    const createdNoOfQue = new this.noOfQueModel(noOfQueData);
    return createdNoOfQue.save();
  }

  async createTypeOfQue(typeOfQueData: TypeOfQue): Promise<TypeOfQue> {
    const createdTypeOfQue = new this.typeOfQueModel(typeOfQueData);
    return createdTypeOfQue.save();
  }

  async updateNoOfQue(id: string, noOfQueData: NoOfQue): Promise<NoOfQue> {
    return this.noOfQueModel
      .findByIdAndUpdate(id, noOfQueData, { new: true })
      .exec();
  }

  async updateTypeOfQue(
    id: string,
    typeOfQueData: TypeOfQue,
  ): Promise<TypeOfQue> {
    return this.typeOfQueModel
      .findByIdAndUpdate(id, typeOfQueData, { new: true })
      .exec();
  }

  async deleteNoOfQue(id: string): Promise<boolean> {
    const deletedNoOfQue = await this.noOfQueModel.findByIdAndDelete(id).exec();
    return !!deletedNoOfQue;
  }

  async deleteTypeOfQue(id: string): Promise<boolean> {
    const deletedTypeOfQue = await this.typeOfQueModel
      .findByIdAndDelete(id)
      .exec();
    return !!deletedTypeOfQue;
  }
}
