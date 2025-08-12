import { Message } from "./message.model";

export interface GetMessagesResponse {
    code: string;
    message: string;
    data: Message[];
  }