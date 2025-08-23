import { AttachedFile } from "./attached-file.model";

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
    public replyContent: string,
    public emoji: Emoji[] | null = null,
    public emojiString: string | null = null,
    public attachedFile: AttachedFile | null = null
  ) {}
}

  export class Emoji {
    constructor(
      public userId: number,
      public username: string,
      public emoji: string
    ) {}
  }
