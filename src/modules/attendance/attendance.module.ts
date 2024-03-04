import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from '../video/schema/video.schema';
import { UserSchema } from '../user/schema/user.schema';
import { CourseSchema } from '../course/schema/course.schema';
import { AttendanceController } from './controllers/attendance.controller';
import { AttendanceService } from './service/attendance.service';
import { AttendanceSchema } from './schema/attendance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Video', schema: VideoSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([
      { name: 'Attendance', schema: AttendanceSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
