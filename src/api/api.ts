import type { User, Post, Comment, Tag } from '../types';

const BASE_URL = 'http://localhost:3000';

// Usuarios
export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
}

export async function getUserByNickname(nickname: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${nickname}`);
  if (!res.ok) throw new Error('Usuario no encontrado');
  return res.json();
}

export async function createUser(data: {
  nickname: string;
  email: string;
  password: string;
}): Promise<User> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'No se pudo crear el usuario');
  }
  return res.json();
}

// Posts
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts`);
  if (!res.ok) throw new Error('Error al obtener posts');
  return res.json();
}

export async function getPostById(id: string): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error('Post no encontrado');
  return res.json();
}

export async function createPost(
  nickname: string,
  data: { description: string }
): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${nickname}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo crear el post');
  return res.json();
}

// Comentarios
export async function getCommentsByPost(postId: string): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/comments/${postId}`);
  if (!res.ok) throw new Error('Error al obtener comentarios');
  return res.json();
}

export async function createComment(
  postId: string,
  data: { content: string; userId: string }
): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/comments/${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo crear el comentario');
  return res.json();
}

// Tags
export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${BASE_URL}/tags`);
  if (!res.ok) throw new Error('Error al obtener tags');
  return res.json();
}