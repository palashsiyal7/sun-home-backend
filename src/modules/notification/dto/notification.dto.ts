export class NotificationDTO {
  title: string;
  message: string;
  users: { userId: string; token: string }[];
}
