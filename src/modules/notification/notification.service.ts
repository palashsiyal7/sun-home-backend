import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firebaseAdmin } from 'src/firebase/firebase-admin.service';
import { UserService } from '../user/service/user.service';
import { NotificationDTO } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private userService: UserService) {}
  // @Cron('*/10 * * * * *')
  async handleCron() {
    try {
      // const users = await this.userService.findUsersByTypeAndPaymentStatus(
      //   1,
      //   false,
      // );
      const users = await this.userService.findAll();
      // const users = await this.userService.findUnpaidTypeOneUsers();
      for (const user of users) {
        if (user.token) {
          try {
            await this.sendNotification(user.token, 'Hi there');
            console.log(`Notification sent to user with token: ${user.token}`);
          } catch (notificationError) {
            console.error(
              `Error sending notification to user with token ${user.token}:`,
              notificationError,
            );
            // Handle notification sending error
          }
        }
      }
    } catch (error) {
      console.error('Error in handleCron:', error);
      // Handle error in fetching users
    }
  }

  private async sendNotification(token: string, message: string) {
    if (!token) {
      throw new Error('FCM token not found');
    }
    const messagePayload = {
      notification: {
        title: 'Helium Education',
        body: message,
      },
      token: token,
    };
    try {
      await firebaseAdmin.messaging().send(messagePayload);
    } catch (firebaseError) {
      console.error(`Error sending message with Firebase:`, firebaseError);
      // Handle error in sending message
      throw firebaseError; // Re-throw if you want the calling function to know about this error
    }
  }

  async sendBulkNotifications(dto: NotificationDTO) {
    for (const user of dto.users) {
      try {
        await this.sendFCMNotification(
          user.userId,
          dto.title,
          dto.message,
          user.token,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send notification to user ${user.userId}: ${error.message}`,
        );
      }
    }
  }

  private async sendFCMNotification(
    userId: string,
    title: string,
    message: string,
    token: string,
  ) {
    const messagePayload = {
      notification: {
        title: title,
        body: message,
      },
      token: token,
    };

    await firebaseAdmin.messaging().send(messagePayload);
  }

  async sendMessageToAllUsers(title: string, message: string): Promise<void> {
    const users = await this.userService.findAll();
    const notificationPromises = users.map(async (user) => {
      try {
        if (user.token) {
          // Check if the user has a valid FCM token
          await this.sendFCMNotification(user.id, title, message, user.token);
        } else {
          console.log(`User ${user.id} does not have a valid FCM token.`);
        }
      } catch (error) {
        console.error(`Failed to send notification to user ${user.id}:`, error);
        // Handle the error appropriately
      }
    });

    await Promise.all(notificationPromises);
  }

  async sendMessageToPaidUsers(title: string, message: string): Promise<void> {
    const users = await this.userService.findAll();
    const notificationPromises = users.map(async (user) => {
      if (user.isPaid) {
        try {
          if (user.token) {
            await this.sendFCMNotification(user.id, title, message, user.token);
          } else {
            console.log(
              `Paid user ${user.id} does not have a valid FCM token.`,
            );
          }
        } catch (error) {
          console.error(
            `Failed to send notification to paid user ${user.id}:`,
            error,
          );
          // Handle the error appropriately
        }
      }
    });

    await Promise.all(notificationPromises);
  }

  async sendMessageToNonPaidUsers(
    title: string,
    message: string,
  ): Promise<void> {
    const users = await this.userService.findAll();
    const notificationPromises = users.map(async (user) => {
      if (!user.isPaid) {
        // Check if the user is not a paid user
        try {
          if (user.token) {
            await this.sendFCMNotification(user.id, title, message, user.token);
          } else {
            console.log(
              `Non-paid user ${user.id} does not have a valid FCM token.`,
            );
          }
        } catch (error) {
          console.error(
            `Failed to send notification to non-paid user ${user.id}:`,
            error,
          );
          // Handle the error appropriately
        }
      }
    });

    await Promise.all(notificationPromises);
  }

  async sendMessageToTeachers(title: string, message: string): Promise<void> {
    const users = await this.userService.findAll();
    const notificationPromises = users.map(async (user) => {
      if (user.userType === 2) {
        // Check if the user is a teacher
        try {
          if (user.token) {
            await this.sendFCMNotification(user.id, title, message, user.token);
          } else {
            console.log(`Teacher ${user.id} does not have a valid FCM token.`);
          }
        } catch (error) {
          console.error(
            `Failed to send notification to teacher ${user.id}:`,
            error,
          );
          // Handle the error appropriately
        }
      }
    });

    await Promise.all(notificationPromises);
  }
}
