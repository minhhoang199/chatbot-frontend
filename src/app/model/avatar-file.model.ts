export class AvatarFile {
    constructor(
      public id: number | null,
      public messageId: number | null,
      public linkFile: string,
      public fileName: string,
      public linkPreview: string,
      public extension: string,
      public userId: number | null,
      public groupId: number | null,
      public file: File | null,
      public type: string | null
    ) {}
  }