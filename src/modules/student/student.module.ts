import { Module } from '@nestjs/common';
import { StudentService } from './service/student.service';
import { StudentController } from './controllers/student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './schema/student.schema';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    SharedModule
  ],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
