export class MessageDto {
    constructor(
      public content: string,
      public sender: string,
      public senderId: number,
      public roomId: number,
      public messageStatus: string,
      public type: string
    ) {}
  }