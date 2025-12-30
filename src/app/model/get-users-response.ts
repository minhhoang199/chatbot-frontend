import { User } from "./user.model";

export interface GetUsersResponse {
    code: string;
    message: string;
    data: User[];
}