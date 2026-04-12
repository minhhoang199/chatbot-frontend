import { Friendship } from "./friendship.model";

export interface GetFriendshipsResponse {
    code: string;
    message: string;
    data: Friendship[];
}