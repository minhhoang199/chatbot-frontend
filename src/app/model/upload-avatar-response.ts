import { AttachedFile } from "./attached-file.model";
import { AvatarFile } from "./avatar-file.model";

export interface UploadAvatarResponse {
    code: string;
    message: string;
    data: AvatarFile;
}