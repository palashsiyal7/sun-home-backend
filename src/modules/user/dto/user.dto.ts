import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  readonly userName: string;

  @ApiProperty({ description: 'Phone number' })
  readonly phoneNumber: number;

  @ApiProperty({ description: 'Email address' })
  readonly email: string;

  @ApiProperty({ description: 'Date of birth' })
  readonly dob: string;

  @ApiProperty({ description: 'City' })
  readonly city: string;

  @ApiProperty({ description: 'State' })
  readonly state: string;

  @ApiProperty({ description: 'Gender' })
  readonly gender: string;

  @ApiProperty({ description: 'User type' })
  readonly userType: number;

  @ApiProperty({ description: 'Reference code' })
  readonly refCode: string;

  @ApiProperty({ description: 'Referral code' })
  readonly referral: string;

  // @ApiProperty({ description: 'Referral codes', type: [String] })
  // readonly referrals: string[]; // Array to store multiple refCodes

  @ApiProperty({ description: 'Wallet points' })
  readonly walletPoint: number;

  @ApiProperty({ description: 'Role ID' })
  readonly role: string;

  @ApiProperty({
    description: 'Array of course IDs for students',
  })
  readonly courses: string[];

  @ApiProperty({
    description: 'Array of subject IDs for teachers',
  })
  readonly subjects: string[];

  @ApiProperty({ description: 'User status' })
  readonly status: number;

  @ApiProperty({ description: 'Image path or URL', required: false })
  image: string;

  @ApiProperty({
    description: 'User ID',
    required: false,
  })
  readonly _id: string;

  @ApiProperty({
    description: 'Password',
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'Indicates if the user is a paid subscriber',
    required: false,
    default: false,
  })
  @IsOptional()
  isPaid?: boolean;

  @ApiProperty({ default: 2 })
  @IsOptional()
  readonly count: number = 2;

  @ApiProperty()
  @IsOptional()
  readonly token: string;

  @ApiProperty()
  @IsOptional()
  readonly deviceId: string;

  @ApiProperty()
  @IsOptional()
  readonly isLoggedIn?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'User name' })
  readonly userName: string;

  @ApiProperty({ description: 'Phone number' })
  readonly phoneNumber: number;

  @ApiProperty({ description: 'Email address' })
  readonly email: string;

  @ApiProperty({ description: 'Date of birth' })
  readonly dob: string;

  @ApiProperty({ description: 'City' })
  readonly city: string;

  @ApiProperty({ description: 'State' })
  readonly state: string;

  @ApiProperty({ description: 'Gender' })
  readonly gender: string;

  @ApiProperty({ description: 'User type' })
  readonly userType: number;

  @ApiProperty({ description: 'Reference code' })
  readonly refCode: string;

  @ApiProperty({ description: 'Referral code' })
  readonly referral: string;

  // @ApiProperty({ description: 'Referral codes', type: [String] })
  // readonly referrals: string[]; // Array to store multiple refCodes

  @ApiProperty({ description: 'Wallet points' })
  readonly walletPoint: number;

  @ApiProperty({ description: 'Role ID' })
  readonly role: string;

  @ApiProperty({
    description: 'Array of course IDs for students',
  })
  readonly courses: string[];

  @ApiProperty({
    description: 'Array of subject IDs for teachers',
  })
  readonly subjects: string[];

  // Added specially for teacher, the array of all the videos uploaded by them. This will allow teachers to reassign already uploaded videos for streaming.
  @ApiProperty({
    description: 'Array of video IDs uploaded by teachers',
  })
  readonly videos: string[];

  @ApiProperty({ description: 'User status' })
  readonly status: number;

  @ApiProperty({ description: 'Image path or URL' })
  image: string;

  @ApiProperty({
    description: 'User ID',
    required: false,
  })
  readonly _id: string;

  @ApiProperty({
    description: 'Password',
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'Indicates if the user is a paid subscriber',
    required: false,
    default: false,
  })
  @IsOptional()
  isPaid?: boolean;

  @ApiProperty({ default: 2 })
  @IsOptional()
  readonly count: number = 2;

  @ApiProperty()
  @IsOptional()
  readonly token: string;

  @ApiProperty()
  @IsOptional()
  readonly deviceId: string;

  @ApiProperty()
  @IsOptional()
  readonly isLoggedIn?: boolean;
}
