import { AttachedFile } from "./attached-file.model";
import { Emoji } from "./message.model";

export class RoomRequest {
    constructor(
      public name: string,
      public roomType: string,
      public emails: string[]
    ) {}
}