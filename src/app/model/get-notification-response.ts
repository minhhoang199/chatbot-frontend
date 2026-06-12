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