import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/modules/course/schema/course.schema';
import { User } from 'src/modules/user/schema/user.schema';
import { Video } from 'src/modules/video/schema/video.schema';
import { Attendance } from '../schema/attendance.schema';
import { AttendanceEntryDto } from '../dto/attendance-entry.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
  ) {}

  // Add new entry on completion of streaming
  async addAttendance(
    attendanceEntryDto: AttendanceEntryDto,
  ): Promise<Attendance> {
    // Check of existing entry is there
    const existingEntry = await this.attendanceModel.findOne({
      course: attendanceEntryDto.courseId,
      lecture: attendanceEntryDto.videoId,
    });

    const userId = attendanceEntryDto.userId;

    if (existingEntry) {
      const isStudentAlreadyAdded = existingEntry.student.some(
        (studentId) => studentId.toString() === userId,
      );

      if (!isStudentAlreadyAdded) {
        // Push the ObjectId of the user, not the whole user object
        existingEntry.student.push(userId);
        await existingEntry.save();
      }
      return existingEntry;
    } else {
      const student = await this.userModel.findById(attendanceEntryDto.userId);
      const course = await this.courseModel.findById(
        attendanceEntryDto.courseId,
      );
      const lecture = await this.videoModel.findById(
        attendanceEntryDto.videoId,
      );
      const newEntry = new this.attendanceModel({
        student: attendanceEntryDto.userId,
        course: attendanceEntryDto.courseId,
        lecture: attendanceEntryDto.videoId,
      });
      return newEntry.save();
    }
  }

  // Get all attendances
  async getAllAttendances(): Promise<Attendance[]> {
    const attendances = await this.attendanceModel.find()
    return attendances
  }
}
