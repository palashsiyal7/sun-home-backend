import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PracticeService } from '../service/practice.service';
import { CreatePracticeDetails } from '../dto/create-practiceDetails.dto';
import { PracticeDetails } from '../schema/practiceDetails.schema';

@Controller()
export class PracticeController {
  constructor(private practiceService: PracticeService) {}

  @Get('/get-analytics/:id')
  async findById(@Param('id') id: string): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: any[];
  }> {
    try {
      const data = await this.practiceService.findAnayticsById(id);
      const updatedPracticeDetail = await this.practiceService.updateAnalytics(
        id,
        data[0].analtyics,
      );

      if (updatedPracticeDetail) {
        return {
          success: true,
          status_code: 200,
          message: 'Data retrieved successfully',
          data: data,
        };
      }
    } catch (error) {
      console.log(error)
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: false,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }

  @Get('/practice-analytics/:id')
  async findAllDetailsByUserId(@Param('id') id: string): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: any[];
  }> {
    try {
      const data = await this.practiceService.findAllDetailsByUserId(id);
      return {
        success: true,
        status_code: 200,
        message: 'Details Found successfully',
        data: data,
      };
     
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: false,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }

  @Post('/practice-data')
  async create(@Body() practiceData: CreatePracticeDetails): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: PracticeDetails;
  }> {
    try {
      const createdDetails =
        await this.practiceService.createPracticeDetails(practiceData);
      if (createdDetails) {
        return {
          success: true,
          status_code: 200,
          message: 'Data added successfully',
          data: createdDetails,
        };
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: false,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }
}
