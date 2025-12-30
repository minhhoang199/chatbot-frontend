import { Room } from "./room.model";

export interface GetRoomsResponse {
    code: string;
    message: string;
    data: Room[];
}