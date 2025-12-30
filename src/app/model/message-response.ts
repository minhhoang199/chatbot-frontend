import { Message } from "./message.model";

export interface MessageResponse {
    code: string;
    message: string;
    data: Message;
  }