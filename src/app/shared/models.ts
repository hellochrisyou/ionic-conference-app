export interface User {
    uId?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
}

export interface FriendMessaging {
    displayName: string;
    email: string;
    photoUrl;
    messages: Messages[];
}

export interface Messages {
    sender: string;
    receiver: string;
    message: string;
}