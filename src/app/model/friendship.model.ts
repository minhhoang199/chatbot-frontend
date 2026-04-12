export class Friendship {
    constructor(
        public id: number,
        public status: string,
        public requestUserEmail: string,
        public acceptedUserEmail:string,
        public blockUserEmail: string
    ) {}
}