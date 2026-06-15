import { Notification } from "./notification.model";

export interface GetNotificationResponse {
    code: string;
    message: string;
    data: Notification[];
}

export interface GetNumberNotificationResponse {
    code: string;
    message: string;
    data: number;
}

export interface GetMessageNotificationResponse {
    code: string;
    message: string;
    data: Record<string, number> | null;
}