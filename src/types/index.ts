export interface User {
  _id: string;
  nickname: string;
  email: string;
}

export interface Image {
  _id: string;
  url: string;
}

export interface Tag {
  _id: string;
  name: string;
}

export interface Comment {
  _id: string;
  postId: string | { _id: string; description: string };
  userId: string | User;
  content: string;
  isVisible?: boolean;
  publishedAt?: string;
}

export interface Post {
  _id: string;
  userId: User;          // ← ahora es un objeto User, no un string
  description: string;
  images: Image[];
  tags: Tag[] | string[];
  comments?: Comment[];
  publishedAt?: string;
}