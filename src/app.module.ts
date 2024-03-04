import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './modules/book/book.module';
import { RouterModule } from '@nestjs/core';
import { routes } from './routes';
import { PreauthMiddleware } from './auth/auth.middleware';
import { RoleModule } from './modules/role/role.module';
import { CourseModule } from './modules/course/course.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { TopicModule } from './modules/topic/topic.module';
import { SubjectModule } from './modules/subject/subject.module';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ClassModule } from './modules/class/class.module';
import { FileUploadModule } from './modules/fileUpload/file-upload.module';
import { QuestionModule } from './modules/question/question.module';
import { UserModule } from './modules/user/user.module';
import { LocationModule } from './modules/location/location.module';
import { PracticeModule } from './modules/practice/practice.module';
import { ReferModule } from './modules/refer/refer.module';
import { TransactionHistoryModule } from './modules/transaction-history/transaction-history.module';
import { QueDetailsModule } from './modules/que-details/que-details.module';
import { VideoModule } from './modules/video/video.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { TestModule } from './modules/test/test.module';
import { NotificationModule } from './modules/notification/notification.module';
import { VideoQuestionsModule } from './modules/video-questions/video-questions.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { VideoPollsModule } from './modules/video-polls/video-polls.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    RouterModule.register(routes),
    MongooseModule.forRoot(process.env.MONGO_URI),
    BookModule,
    RoleModule,
    SubjectModule,
    CourseModule,
    ChapterModule,
    TopicModule,
    StudentModule,
    TeacherModule,
    ClassModule,
    FileUploadModule,
    QuestionModule,
    UserModule,
    LocationModule,
    PracticeModule,
    ReferModule,
    TransactionHistoryModule,
    QueDetailsModule,
    VideoModule,
    AttendanceModule,
    TestModule,
    NotificationModule,
    VideoQuestionsModule,
    DiscountsModule,
    VideoPollsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreauthMiddleware)
      .forRoutes(
        '/courses/enabledTrue',
        '/classes/enabledTrue',
        '/register',
        '/courses/alldetails',
        '/questions/practice',
        '/questions/custompractice',
        '/que-details/enabledTrue',
        '/practice/practice-data',
        '/practice/get-analytics/:id',
        '/test/get-tests',
        '/test/update-userStatus',
        '/test/post-test-data',
        '/test/custom-test'  
      );
  }
}
