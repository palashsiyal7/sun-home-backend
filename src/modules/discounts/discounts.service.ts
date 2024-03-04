import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Discount } from './discounts.schema';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel('Discount') private readonly discountModel: Model<Discount>,
  ) {}

  async createDiscount(
    createDiscountDto: CreateDiscountDto,
  ): Promise<Discount> {
    const { title } = createDiscountDto;

    // Generate the unique code using the title
    const generatedCode = this.generateUniqueCode(title);
    // const generatedCode = this.generateUniqueCode();
    const createdDiscount = new this.discountModel({
      ...createDiscountDto,
      code: generatedCode,
    });
    return await createdDiscount.save();
  }

  // private generateUniqueCode(): string {
  //   // Logic to generate a unique 6-digit alphanumeric code
  //   const characters =
  //     // 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //   let code = '';

  //   for (let i = 0; i < 6; i++) {
  //     code += characters.charAt(Math.floor(Math.random() * characters.length));
  //   }

  //   return code;
  // }

  private generateUniqueCode(title: string): string {
    // Extract the first four characters from the title and convert them to uppercase
    let code = title.slice(0, 4).toUpperCase();

    // Ensure that the code has at least 4 characters by padding it with 'X' if needed
    while (code.length < 4) {
      code += 'X';
    }

    // Generate two random numbers for the last two characters
    for (let i = 0; i < 2; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }

    return code;
  }

  async getAll(): Promise<Discount[]> {
    return this.discountModel.find();
  }

  async updateDiscount(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    const discount = await this.discountModel.findByIdAndUpdate(
      id,
      updateDiscountDto,
      { new: true },
    );
    if (!discount) {
      throw new NotFoundException(`Discount with ID "${id}" not found`);
    }
    return discount;
  }

  async deleteDiscount(id: string): Promise<void> {
    const result = await this.discountModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Discount with ID "${id}" not found`);
    }
  }
}
