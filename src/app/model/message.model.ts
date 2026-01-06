import { AttachedFile } from "./attached-file.model";
import { MessageEditHistory } from "./message-edit-history.model";

export class Message {
  constructor(
    public id: number,
    public content: string,
    public sender: string,
    public senderId: number,
    public roomId: number,
    public messageStatus: string,
    public type: string,
    public createdAt: string,
    public updatedAt: string,
    public isReply: boolean,
    public replyId: number | null,
    public replyContent: string | null,
    public replyCreatedDate: string | null,
    public emoji: Emoji[] | null = null,
    public emojiString: string | null = null,
    public attachedFile: AttachedFile | null = null,
    public delFlag: boolean,
    public edited: boolean = false,
  ) {}

  // optional history (array of {content, editedAt}) populated when requested
  public editHistory?: MessageEditHistory[];
}

  export class Emoji {
    constructor(
      public userId: number,
      public username: string,
      public emoji: string
    ) {}
  }
