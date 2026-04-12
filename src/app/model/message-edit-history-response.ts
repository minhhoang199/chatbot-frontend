import { MessageEditHistory } from "./message-edit-history.model";

export interface MessageEditHistoryResponse {
    code: string;
    message: string;
    data: MessageEditHistory[];
  }