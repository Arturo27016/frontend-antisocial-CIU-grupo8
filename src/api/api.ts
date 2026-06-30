/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`);
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
  const res = await fetch(`${BASE_URL}/comments`);
  if (!res.ok) throw new Error('Error al obtener comentarios');
  const all: Comment[] = await res.json();
  return all.filter((c: any) => {
    const id = typeof c.postId === 'object' ? c.postId._id : c.postId;
    return id === postId;
  });
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

export async function addTagToPost(postId: string, tagId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/tags/${tagId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('No se pudo agregar el tag');
}

// Imagen en post
export async function uploadPostImage(postId: string, file: File): Promise<{ url: string; _id: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE_URL}/posts/${postId}/images`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('No se pudo subir la imagen');
  return res.json();
}

// Eliminar Post
export async function deletePost(postId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('No se pudo eliminar el post');
}

// Seguir, dejar de seguir y obtener seguidores y seguidos
export async function getFollowers(nickname: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/users/${nickname}/followers`);
  if (!res.ok) throw new Error('Error al obtener seguidores');
  return res.json();
}

export async function followUser(nickname: string, followedNickname: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${nickname}/following/${followedNickname}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('No se pudo seguir al usuario');
}

export async function unfollowUser(nickname: string, followedNickname: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${nickname}/following/${followedNickname}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('No se pudo dejar de seguir al usuario');
}

export async function getFollowing(nickname: string): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users/${nickname}/following`);
  if (!res.ok) throw new Error('Error al obtener usuarios seguidos');
  return res.json();
}

// Borra cuenta
export async function deleteUser(nickname: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${nickname}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('No se pudo eliminar la cuenta');
}