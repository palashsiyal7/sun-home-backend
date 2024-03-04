import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AttendanceService } from '../service/attendance.service';
import { AttendanceEntryDto } from '../dto/attendance-entry.dto';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async getAttendances() {
    try {
      const attendances = await this.attendanceService.getAllAttendances();
      return attendances;
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

  @Post('/add-attendance')
  async addAttendance(
    @Body(ValidationPipe) attendanceEntryDto: AttendanceEntryDto,
  ) {
    try {
      const newEntry =
        await this.attendanceService.addAttendance(attendanceEntryDto);
      return {
        success: true,
        status_code: 200,
        message: 'Attendance updated successfully',
        data: newEntry,
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
