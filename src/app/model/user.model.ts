export class User {
    constructor(
        public type: string,
        public id: number,
        public username: string,
        public role: string,
        public email:string,
        public avatar: string | null,
        public selected: boolean = false
    ) {}
}