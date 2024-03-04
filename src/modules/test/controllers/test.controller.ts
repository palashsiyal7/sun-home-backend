import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TestService } from '../service/test.service';
import { TestDetail } from '../schema/test.schema';
import { Types } from 'mongoose';

@Controller('')
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  async findAll(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: TestDetail[];
  }> {
    try {
      const allChapters = await this.testService.findAll();
      return {
        success: true,
        status_code: 200,
        message: 'Chapters retrieved successfully',
        data: allChapters,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: true,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }

  @Get('/test-report/:id')
  async generateReportByTestId(
    @Param('id')
    id: string,
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: any;
  }> {
    try {
      const report = await this.testService.generateReport({
        testId: new Types.ObjectId(id),
      });
      return {
        success: true,
        status_code: 200,
        message: 'Test Report retrieved successfully',
        data: report,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: true,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }
  
  @Post('')
  async createTestData(
    @Body()
    testData: {
      testTitle: string;
      description: string;
      startTime: string;
      endTime: string;
      testType: string;
      duration: number;
      correctMarks: number;
      inCorrectMarks: number;
      sections: [];
      courseId: string;
    },
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: TestDetail;
  }> {
    try {
      const question = await this.testService.createTestData(testData);
      return {
        success: true,
        status_code: 200,
        message: 'Test created successfully',
        data: question,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: true,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }

  @Post('/custom-test')
  async createCustomTestData(
    @Body()
    testData: {
      duration: number;
      section: any[];
      courseId: string;
      userId:string;
      noOfQues: number;
      level:string
    },
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: TestDetail;
  }> {
    try {
      const question = await this.testService.createCustomTestData(testData);
      return {
        success: true,
        status_code: 200,
        message: 'Test created successfully',
        data: question,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: true,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }
  @Post('/get-tests')
  async getTestData(
    @Body()
    testData: {
      userId: string;
      courseId: string;
    },
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: [];
  }> {
    try {
      const testDetails = await this.testService.getTestData(testData);
      return {
        success: true,
        status_code: 200,
        message: 'Test retrieved successfully',
        data: testDetails,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: true,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }

  @Post('/get-tests-reports')
  async getTestReportData(
    @Body()
    testData: {
      userId: string;
      courseId: string;
    },
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: [];
  }> {
    try {
      const testDetails = await this.testService.getTestReportData(testData);
      return {
        success: true,
        status_code: 200,
        message: 'Test retrieved successfully',
        data: testDetails,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: true,
        status_code: 400,
        message: errorMessage,
        data: null,
      };
    }
  }

  @Post('/update-userStatus')
  async updateUserTestStatus(
    @Body()
    testUpdateData: {
      userId: string;
      testId: string;
      isCheated: boolean;
    },
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: TestDetail;
  }> {
    try {
      const updatedTest = await this.testService.updateUserTestStatus({
        userId: new Types.ObjectId(testUpdateData.userId),
        testId: new Types.ObjectId(testUpdateData.testId),
        isCheated: testUpdateData.isCheated,
      });

      return {
        success: true,
        status_code: 200,
        message: 'Test user status updated successfully',
        data: updatedTest,
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

  @Post('/post-test-data')
  async postTestData(
    @Body()
    testData: {
      userId: string;
      testId: string;
      isCheated: boolean;
      timeTaken: string;
      queArr: any[];
    },
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: [];
  }> {
    try {
      const testDetails = await this.testService.postTestData({
        userId: new Types.ObjectId(testData.userId),
        testId: new Types.ObjectId(testData.testId),
        isCheated: testData.isCheated,
        queArr: testData.queArr,
        timeTaken: testData.timeTaken,
      });

      const updateMarks= await this.testService.calculateMarks(testDetails._id.toString())

      return {
        success: true,
        status_code: 200,
        message: 'Test Details Added successfully',
        data: updateMarks,
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

  @Delete(':id')
  async deleteCourse(
    @Param('id') id: string,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const deletedTest = await this.testService.delete(id);
    if (deletedTest) {
      return {
        success: true,
        status_code: 200,
        message: 'Test deleted successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Test not found',
      };
    }
  }
}
