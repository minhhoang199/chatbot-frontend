export class AttachedFile {
    constructor(
      public id: number | null,
      public messageId: number | null,
      public linkFile: string,
      public fileName: string,
      public linkPreview: string,
      public extension: string,
      public roomId: number,
      public file: File | null,
      public type: string | null
    ) {}
  }