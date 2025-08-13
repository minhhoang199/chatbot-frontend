export class MessageDto {
    constructor(
      public id: number | null,
      public content: string | null,
      public sender: string,
      public senderId: number,
      public roomId: number,
      public messageStatus: string,
      public type: string,
      public replyId: number | null = null,
      public emoji: Emoji[] | null = null,
  ) {}
}

  export class Emoji {
    constructor(
      public userId: number,
      public username: string,
      public emoji: string
    ) {}
  }