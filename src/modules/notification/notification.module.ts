import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserModule } from '../user/user.module';

@Module({
  // imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  imports: [UserModule], // Import UserModule
  // providers: [NotificationService, UserService],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
