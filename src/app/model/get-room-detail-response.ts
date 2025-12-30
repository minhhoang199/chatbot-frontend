import { Room } from "./room.model";

export interface GetRoomDetailResponse {
    code: string;
    message: string;
    data: Room;
}