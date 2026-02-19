import { db } from "@/prisma/db";

interface NotificationParams {
  userId: string;
  title: string;
  message: string;
  link?: string;
}

/**
 * Creates a single notification for a user
 */
export async function createNotification({ userId, title, message, link }: NotificationParams) {
  try {
    return await db.notification.create({
      data: {
        userId,
        title,
        message,
        link,
        status: "UNREAD"
      }
    });
  } catch (error) {
    console.error(`[NOTIFICATION_CREATE_ERROR]: ${error}`);
    return null;
  }
}

/**
 * Sends notifications to multiple users at once
 */
export async function createBulkNotifications(userIds: string[], params: Omit<NotificationParams, 'userId'>) {
  try {
    const data = userIds.map(userId => ({
      userId,
      title: params.title,
      message: params.message,
      link: params.link,
      status: "UNREAD" as const
    }));

    return await db.notification.createMany({
      data,
      skipDuplicates: true
    });
  } catch (error) {
    console.error(`[NOTIFICATION_BULK_ERROR]: ${error}`);
    return null;
  }
}
