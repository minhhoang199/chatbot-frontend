export interface SignInResponse {
    data: {
        token: string;
        type: string;
        id: number;
        username: string;
        role: string;
        email: string;
        linkAvatar: string;
    };
    code: string;
    message: string;
  }