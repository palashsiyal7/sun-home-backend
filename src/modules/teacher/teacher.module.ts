import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherSchema } from './schema/teacher.schema';
import { TeacherController } from './controllers/teacher.controller';
import { TeacherService } from './service/teacher.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Teacher', schema: TeacherSchema }]),
    SharedModule
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
