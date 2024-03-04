import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationService } from './registration.service';
import { Student, StudentSchema } from '../student/schema/student.schema';
import { Teacher, TeacherSchema } from '../teacher/schema/teacher.schema';
import { RegistrationController } from './registration.controller';
import { TeacherService } from '../teacher/service/teacher.service';
import { StudentService } from '../student/service/student.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService, TeacherService, StudentService],
  exports: [RegistrationService],
})
export class SharedModule {}
