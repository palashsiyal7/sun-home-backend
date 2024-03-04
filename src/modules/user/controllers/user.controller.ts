import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from '../dto/user-login.dto';
import { User } from '../schema/user.schema';

@ApiTags('Users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  private createSuccessResponse(data?: any, message: string = '') {
    return {
      success: true,
      status_code: 200,
      message,
      data,
    };
  }

  private createErrorResponse(message: string, status_code: number = 500) {
    return {
      success: false,
      status_code,
      message,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users successfully retrieved',
  })
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return this.createSuccessResponse(users);
    } catch (error) {
      return this.createErrorResponse('Error while fetching users');
    }
  }

  @Get('/token')
  async getUsersWithToken() {
    const users = await this.userService.findUsersWithToken();
    return users;
  }

  @Get('/filter')
  async findUnpaidTypeOneUsers() {
    const users = await this.userService.findUnpaidTypeOneUsers();
    return users;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      return this.createSuccessResponse(user);
      // return user
    } catch (error) {
      return this.createErrorResponse(
        `Error while fetching user with ID: ${id}`,
      );
    }
  }

  @Get(':userId/:courseId')
  async getUserAndCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.userService.findUserSubjects(userId, courseId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 500, description: 'Error while creating user' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.userService.create(createUserDto);
      return this.createSuccessResponse(
        createdUser,
        'User created successfully',
      );
    } catch (error) {
      return this.createErrorResponse('Error while creating user');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User login based on type' })
  @ApiResponse({ status: 201, description: 'User logged in successfully' })
  @ApiResponse({ status: 500, description: 'User login failed' })
  async login(@Body() userLoginDto: UserLoginDto) {
    try {
      return this.userService.loginBasedOnType(userLoginDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('addCourses')
  @ApiOperation({ summary: 'Add or update courses for a user' })
  @ApiResponse({
    status: 200,
    description: 'Courses added or updated successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Error while adding or updating courses',
  })
  @ApiBody({ type: CreateUserDto })
  async addUpdateCourses(@Body() createUserDto: CreateUserDto) {
    try {
      const { _id, courses } = createUserDto;

      // Implement your logic to add or update the courses based on user ID
      const result = await this.userService.addOrUpdateCourses(_id, courses);
      return this.createSuccessResponse(
        result,
        'Courses added or updated successfully',
      );
    } catch (error) {
      console.log(error);
      return this.createErrorResponse('Error while adding or updating courses');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.update(id, updateUserDto);
      return this.createSuccessResponse(
        updatedUser,
        'User updated successfully',
      );
    } catch (error) {
      return this.createErrorResponse(
        `Error while updating user with ID: ${id}`,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.userService.delete(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      return this.createErrorResponse(
        `Error while deleting user with ID: ${id}`,
      );
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register or update user' })
  @ApiResponse({
    status: 200,
    description: 'User registered or updated successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Error while registering or updating user',
  })
  @ApiBody({ type: CreateUserDto })
  async registerOrUpdateUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.registerOrUpdateUser(createUserDto);
      return {
        success: true,
        status_code: 200,
        message: 'User registered or updated successfully',
        data: user,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return {
        success: false,
        status_code: 500,
        message: errorMessage,
        data: null,
      };
    }
  }

  @Post('exist') // Endpoint path: /users/exist
  @ApiOperation({ summary: 'Check if phone number exists' })
  @ApiBody({ type: CreateUserDto })
  async checkIfPhoneNumberExists(
    @Body() { phoneNumber }: { phoneNumber: string },
  ): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: User;
  }> {
    try {
      const user = await this.userService.findByPhoneNumber(phoneNumber);
      if (user) {
        return {
          success: true,
          status_code: 400,
          message: 'Phone number already registered',
          data: user,
        };
      } else {
        return {
          success: true,
          status_code: 200,
          message: 'Phone number is not registered',
          data: user,
        };
      }
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

  @Post('refcode')
  @ApiOperation({ summary: 'Check if referral code exists' })
  async checkIfRefCodeExists(@Body('refCode') refCode: string): Promise<{
    success: boolean;
    status_code: number;
    message: string;
    data: any[];
  }> {
    try {
      const user = await this.userService.findByRefCode(refCode);

      if (user) {
        return {
          success: false,
          status_code: 400,
          message: 'Referral code already registered',
          data: [],
        };
      }
      return {
        success: true,
        status_code: 200,
        message: 'Referral code not found in the database',
        data: [],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      return {
        success: false,
        status_code: 500,
        message: errorMessage,
        data: [],
      };
    }
  }

  // @Post('/send-notification')
  // async sendNotification(@Body() body: { userId: string; message: string }) {
  //   try {
  //     await this.userService.sendFCMNotification(body.userId, body.message);
  //     return {
  //       success: true,
  //       status_code: 200,
  //       message: 'Notification sent successfully',
  //       data: null, // Or any relevant data you might want to return
  //     };
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : 'An error occurred';
  //     console.log(errorMessage, 'error message');
  //     return {
  //       success: false,
  //       status_code: 500,
  //       message: errorMessage,
  //       data: null,
  //     };
  //   }
  // }
}
