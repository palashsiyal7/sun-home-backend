import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDTO } from './dto/notification.dto';

@Controller()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('/custom')
  async triggerCustomNotifications() {
    // await this.notificationService.sendCustomNotifications();
    await this.notificationService.handleCron();
    return { message: 'Custom notifications process initiated' };
  }

  @Post()
  async sendNotification(@Body() notificationDTO: NotificationDTO) {
    await this.notificationService.sendBulkNotifications(notificationDTO);
    return { message: 'Bulk notifications delivered' };
  }

  @Post('/all')
  async sendToAllUsers(
    @Body() body: { title: string; message: string },
  ): Promise<{ message: string }> {
    await this.notificationService.sendMessageToAllUsers(
      body.title,
      body.message,
    );
    return { message: 'Notifications sent to all users successfully.' };
  }

  @Post('/paid')
  async sendToPaidUsers(
    @Body() body: { title: string; message: string },
  ): Promise<{ message: string }> {
    await this.notificationService.sendMessageToPaidUsers(
      body.title,
      body.message,
    );
    return { message: 'Notifications sent to paid users successfully.' };
  }

  @Post('/free')
  async sendToNonPaidUsers(
    @Body() body: { title: string; message: string },
  ): Promise<{ message: string }> {
    await this.notificationService.sendMessageToNonPaidUsers(
      body.title,
      body.message,
    );
    return { message: 'Notifications sent to non-paid users successfully.' };
  }

  @Post('/teachers')
  async sendToTeachers(
    @Body() body: { title: string; message: string },
  ): Promise<{ message: string }> {
    await this.notificationService.sendMessageToTeachers(
      body.title,
      body.message,
    );
    return { message: 'Notifications sent to teachers successfully.' };
  }
}
