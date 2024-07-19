export interface User {
    id: string;
    username: string;
    password: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    created_at?: string;
}

export interface Comment {
    id: string;
    content: string;
    postId: string;
    userId: string;
}