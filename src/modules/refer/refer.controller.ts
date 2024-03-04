import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ReferService } from './refer.service';
import { Refer } from './schema/refer.schema';

@Controller()
export class ReferController {
  constructor(private readonly referService: ReferService) {}

  @Post()
  async createRefer(
    @Body() referData: Partial<Refer>,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.referService.createRefer(referData);
    return {
      success: true,
      status_code: 200,
      message: 'Refer added successfully',
    };
  }

  @Get()
  async getAllRefers(): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Refer[];
  }> {
    const refers = await this.referService.getAllRefers();
    return {
      success: true,
      status_code: 200,
      message: 'Refers retrieved successfully',
      data: refers,
    };
  }

  @Get(':id')
  async getReferById(@Param('id') id: string): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: Refer;
  }> {
    const refer = await this.referService.getReferById(id);
    if (!refer) {
      return {
        success: false,
        status_code: 404,
        message: 'Refer not found',
        data: null,
      };
    }
    return {
      success: true,
      status_code: 200,
      message: 'Refer retrieved successfully',
      data: refer,
    };
  }

  @Put(':id')
  async updateRefer(
    @Param('id') id: string,
    @Body() referData: Partial<Refer>,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    const updatedRefer = await this.referService.updateRefer(id, referData);
    if (updatedRefer) {
      return {
        success: true,
        status_code: 200,
        message: 'Refer updated successfully',
      };
    } else {
      return {
        success: false,
        status_code: 404,
        message: 'Refer not found or update failed',
      };
    }
  }

  @Delete(':id')
  async removeRefer(
    @Param('id') id: string,
  ): Promise<{ success: boolean; status_code: number; message: string }> {
    await this.referService.removeRefer(id);
    return {
      success: true,
      status_code: 200,
      message: 'Refer deleted successfully',
    };
  }
}
