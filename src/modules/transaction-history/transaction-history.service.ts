import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { TransactionHistory } from './schema/transaction-history.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TransactionHistoryService {
  constructor(
    @InjectModel(TransactionHistory.name)
    private readonly transactionHistoryModel: Model<TransactionHistory>,
  ) {}
  async getAllTransactionHistories(): Promise<TransactionHistory[]> {
    return this.transactionHistoryModel.find().populate({
      path: 'referredUsers',
      model: 'User',
    });

    // .populate('user')
    // .populate('referredUsers')
    // .exec();
  }

  async getTransactionHistoryById(id: string): Promise<TransactionHistory> {
    try {
      const objectId = new Types.ObjectId(id); // Convert the string ID to a MongoDB ObjectId
      const transactionHistory = await this.transactionHistoryModel
        .findById(objectId)
        .populate('user')
        .populate('referredUsers')
        .exec();

      if (!transactionHistory) {
        throw new NotFoundException('Transaction history not found');
      }

      return transactionHistory;
    } catch (error) {
      throw new NotFoundException('Transaction history not found');
    }
  }
}
