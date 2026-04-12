import { AttachedFile } from "./attached-file.model";

export class MessageEditHistory {
  constructor(
    public id: number,
    public content: string,
    public messageId: number,
    public createdAt: string,
    public updatedAt: string,
    public delFlag: boolean,
  ) {}
}
