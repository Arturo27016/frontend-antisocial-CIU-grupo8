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
  postId: string;
  userId: string;
  content: string;
}

export interface Post {
  _id: string;
  userId: string;
  description: string;
  images: Image[];
  tags: Tag[] | string[];
  comments?: Comment[];
}