import { Routes } from '@nestjs/core';
import { BookModule } from './modules/book/book.module';
import { CourseModule } from './modules/course/course.module';
import { SubjectModule } from './modules/subject/subject.module';
import { RoleModule } from './modules/role/role.module';
import { StudentModule } from './modules/student/student.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { TopicModule } from './modules/topic/topic.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ClassModule } from './modules/class/class.module';
import { FileUploadModule } from './modules/fileUpload/file-upload.module';
import { SharedModule } from './modules/shared/shared.module';
import { QuestionModule } from './modules/question/question.module';
import { UserModule } from './modules/user/user.module';
import { LocationModule } from './modules/location/location.module';
import { PracticeModule } from './modules/practice/practice.module';
import { ReferModule } from './modules/refer/refer.module';
import { TransactionHistoryModule } from './modules/transaction-history/transaction-history.module';
import { QueDetailsModule } from './modules/que-details/que-details.module';
import { VideoModule } from './modules/video/video.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TestModule } from './modules/test/test.module';
import { VideoQuestionsModule } from './modules/video-questions/video-questions.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { VideoPollsModule } from './modules/video-polls/video-polls.module';

export const routes: Routes = [
  {
    path: '/books',
    module: BookModule,
  },
  {
    path: '/courses',
    module: CourseModule,
  },
  {
    path: '/roles',
    module: RoleModule,
  },
  {
    path: '/subjects',
    module: SubjectModule,
  },
  {
    path: '/students',
    module: StudentModule,
  },
  {
    path: '/chapters',
    module: ChapterModule,
  },
  {
    path: '/topics',
    module: TopicModule,
  },
  {
    path: '/teachers',
    module: TeacherModule,
  },
  {
    path: '/classes',
    module: ClassModule,
  },
  {
    path: '/files',
    module: FileUploadModule,
  },
  {
    path: '/questions',
    module: QuestionModule,
  },
  {
    path: '/register',
    module: SharedModule,
  },
  {
    path: '/users',
    module: UserModule,
  },
  {
    path: '/location',
    module: LocationModule,
  },
  {
    path: '/practice',
    module: PracticeModule,
  },
  {
    path: '/refer',
    module: ReferModule,
  },
  {
    path: '/transaction-history',
    module: TransactionHistoryModule,
  },
  {
    path: '/que-details',
    module: QueDetailsModule,
  },
  {
    path: '/videos',
    module: VideoModule,
  },
  {
    path: '/attendances',
    module: AttendanceModule,
  },
  {
    path: '/notification',
    module: NotificationModule,
  },
  {
    path: '/test',
    module: TestModule
  },
  {
    path: '/video-questions',
    module: VideoQuestionsModule
  },
  {
    path: '/discount',
    module: DiscountsModule,
  },
  {
    path: '/video-polls',
    module: VideoPollsModule,
  },
];
