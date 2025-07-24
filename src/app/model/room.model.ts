export class Room {
    constructor(
      public id: number,
      public name: string,
      public usernames: string,
      public roomType: string,
      public lastMessageContent: string,
      public lastMessageTime: string
    ) {}
  }