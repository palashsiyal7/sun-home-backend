import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistory } from './schema/transaction-history.schema';

@Controller()
export class TransactionHistoryController {
  constructor(
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}
  // @Get()
  // async getAllTransactionHistories(): Promise<{ data: TransactionHistory[] }> {
  //   const histories =
  //     await this.transactionHistoryService.getAllTransactionHistories();
  //   return { data: histories };
  // }

  @Get()
  async getAllTransactionHistories(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: TransactionHistory[];
  }> {
    try {
      const histories =
        await this.transactionHistoryService.getAllTransactionHistories();
      return {
        success: true,
        status_code: 200,
        message: 'Transaction histories retrieved successfully',
        data: histories,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        status_code: 500,
        message: 'Error while retrieving transaction histories',
        data: null,
      };
    }
  }

  @Get(':id')
  async getTransactionHistoryById(@Param('id') id: string): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: TransactionHistory | null;
  }> {
    try {
      const history =
        await this.transactionHistoryService.getTransactionHistoryById(id);
      return {
        success: true,
        status_code: 200,
        message: 'Transaction history retrieved successfully',
        data: history,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        status_code: 500,
        message: 'Error while retrieving transaction history',
        data: null,
      };
    }
  }
}
