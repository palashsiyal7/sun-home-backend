import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { DiscountService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Controller()
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.createDiscount(createDiscountDto);
  }

  @Get()
  async getAll() {
    try {
      const discounts = await this.discountService.getAll();
      return {
        success: true,
        status_code: 200,
        message: 'Discounts retrieved successfully',
        data: discounts,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: false,
        status_code: 400, // Internal Server Error
        message: errorMessage,
        data: null,
      };
    }
  }

  @Put(':id')
  async updateDiscount(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<any> {
    try {
      const updatedDiscount = await this.discountService.updateDiscount(
        id,
        updateDiscountDto,
      );
      return {
        success: true,
        status_code: 200,
        message: 'Discount updated successfully',
        data: updatedDiscount,
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
  async deleteDiscount(@Param('id') id: string): Promise<any> {
    try {
      await this.discountService.deleteDiscount(id);
      return {
        success: true,
        status_code: 200,
        message: 'Discount deleted successfully',
        data: null,
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
}
