import { Friendship } from "./friendship.model";

export interface GetFriendshipDetailResponse {
    code: string;
    message: string;
    data: Friendship;
}