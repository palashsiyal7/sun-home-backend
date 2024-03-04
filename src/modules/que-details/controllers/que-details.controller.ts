import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { QueDetailsService } from '../service/que-details.service';
import { NoOfQue } from '../schema/noOfQue.schema';
import { TypeOfQue } from '../schema/typeOfQue.schema';
import { CreateNoOfQueDto, UpdateNoOfQueDto } from '../dto/noOfQue.dto';
import { CreateTypeOfQueDto, UpdateTypeOfQueDto } from '../dto/typeOfQue.dto';

@Controller('')
export class QueDetailsController {

    constructor(private queDetailService: QueDetailsService) {}
  
    @Get()
    async findAll(): Promise<{
      success: boolean;
      status_code: number;
      message: string;
      data:{ noOfQues: NoOfQue[], typeOfQues: TypeOfQue[] }
    }> {
      const details = await this.queDetailService.findAllDetails();
      return {
        success: true,
        status_code: 200,
        message: 'Details retrieved successfully',
        data: details,
      };
    }


    @Get('/allTrue')
    async findAllTrueTypes(): Promise<{
      success: boolean;
      status_code: number;
      message: string;
      data:{ }
    }> {
      const details = await this.queDetailService.findAllTrueTypes();
      return {
        success: true,
        status_code: 200,
        message: 'Details retrieved successfully',
        data: details,
      };
    }

    @Get('/enabledTrue')
    async findAllTrue(): Promise<{
      success: boolean;
      status_code: number;
      message: string;
      data: { noOfQues: NoOfQue[], typeOfQues: TypeOfQue[] }
    }> {
      const details = await this.queDetailService.findAllTrue();
      return {
        success: true,
        status_code: 200,
        message: 'Classes retrieved successfully',
        data: details,
      };
    } 

    @Post('/noOfQue')
    async createNoOfQue(
      @Body() noOfQueData: CreateNoOfQueDto,
    ): Promise<{ success: boolean; status_code: number; message: string }> {
      await this.queDetailService.createNoOfQue(noOfQueData);
      return {
        success: true,
        status_code: 200,
        message: 'detail added successfully',
      };
    }

    @Post('/typeOfQue')
    async createTypeOfQue(
      @Body() typeOfQueData: CreateTypeOfQueDto,
    ): Promise<{ success: boolean; status_code: number; message: string }> {
      await this.queDetailService.createTypeOfQue(typeOfQueData);
      return {
        success: true,
        status_code: 200,
        message: 'detail added successfully',
      };
    }

    @Put('/noOfQue/:id')
    async updateNoOfQue(
      @Param('id') id: string,
      @Body() courseData: UpdateNoOfQueDto,
    ): Promise<{ success: boolean; status_code: number; message: string }> {
      const updatedDetail = await this.queDetailService.updateNoOfQue(id, courseData);
      if (updatedDetail) {
        return {
          success: true,
          status_code: 200,
          message: 'Detail updated successfully',
        };
      } else {
        return {
          success: false,
          status_code: 404,
          message: 'Detail not found',
        };
      }
    }

    @Put('/typeOfQue/:id')
    async updateTypeOfQue(
      @Param('id') id: string,
      @Body() courseData: UpdateTypeOfQueDto,
    ): Promise<{ success: boolean; status_code: number; message: string }> {
      const updatedDetail = await this.queDetailService.updateTypeOfQue(id, courseData);
      if (updatedDetail) {
        return {
          success: true,
          status_code: 200,
          message: 'Detail updated successfully',
        };
      } else {
        return {
          success: false,
          status_code: 404,
          message: 'Detail not found',
        };
      }
    }
    
    @Delete('/noOfQue/:id')
    async deleteNoOfQue(
      @Param('id') id: string,
    ): Promise<{ success: boolean; status_code: number; message: string }> {
      const deletedClass = await this.queDetailService.deleteNoOfQue(id);
      if (deletedClass) {
        return {
          success: true,
          status_code: 200,
          message: 'Detail deleted successfully',
        };
      } else {
        return {
          success: false,
          status_code: 404,
          message: 'Detail not found',
        };
      }
    }
    @Delete('/typeOfQue/:id')
    async deleteTypeOfQue(
      @Param('id') id: string,
    ): Promise<{ success: boolean; status_code: number; message: string }> {
      const deletedClass = await this.queDetailService.deleteTypeOfQue(id);
      if (deletedClass) {
        return {
          success: true,
          status_code: 200,
          message: 'Detail deleted successfully',
        };
      } else {
        return {
          success: false,
          status_code: 404,
          message: 'Detail not found',
        };
      }
    }
}
