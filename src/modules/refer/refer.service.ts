import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Refer, ReferDocument } from './schema/refer.schema';
import { User } from '../user/schema/user.schema';
import { Role } from '../role/schema/role.schema';

@Injectable()
export class ReferService {
  constructor(
    @InjectModel(Refer.name) private readonly referModel: Model<ReferDocument>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async createRefer(referData: Partial<Refer>): Promise<Refer> {
    const createdRefer = new this.referModel(referData);
    return createdRefer.save();
  }

  async getAllRefers(): Promise<Refer[]> {
    return this.referModel.find().populate('roleId').exec();
  }

  async getReferById(id: string): Promise<Refer> {
    const refer = await this.referModel.findById(id).exec();
    if (!refer) {
      throw new NotFoundException(`Refer with ID ${id} not found`);
    }
    return refer;
  }

  async updateRefer(id: string, referData: Partial<Refer>): Promise<Refer> {
    const updatedRefer = await this.referModel
      .findByIdAndUpdate(id, referData, { new: true })
      .exec();
    if (!updatedRefer) {
      throw new NotFoundException(`Refer with ID ${id} not found`);
    }
    return updatedRefer;
  }

  async removeRefer(id: string): Promise<Refer> {
    const removedRefer = await this.referModel.findByIdAndRemove(id).exec();
    if (!removedRefer) {
      throw new NotFoundException(`Refer with ID ${id} not found`);
    }
    return removedRefer;
  }

  async getDefaultPointsForRefer(roleName: string): Promise<number> {
    // Find the role by its name and get its ObjectId
    const role = await this.roleModel.findOne({ roleName }).exec();
    if (!role) {
      throw new NotFoundException(`Role with name ${roleName} not found`);
    }

    // Find the refer document using the role's ObjectId
    const refer = await this.referModel.findOne({ roleId: role._id }).exec();
    if (!refer) {
      throw new NotFoundException(`Refer for role ID ${role._id} not found`);
    }

    return refer.defaultPoints;
  }
}
