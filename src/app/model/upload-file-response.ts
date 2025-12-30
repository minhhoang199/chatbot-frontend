import { AttachedFile } from "./attached-file.model";
import { Room } from "./room.model";

export interface UploadFileResponse {
    code: string;
    message: string;
    data: AttachedFile;
}