
export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
}