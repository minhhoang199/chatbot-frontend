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
    public emoji: string | null = null,
  ) {}
}
