import { Room } from "./room.model";

export interface GetAllRoomResponse {
    code: string;
    message: string;
    data: Room[];
  }