export class Notification {
    constructor(
        public id: number,
        public userId: number,
        public messageId: number,
        public content: string,
        public type: string,
        public isRead?: boolean,
        public createdAt?: string
    ) {}
}