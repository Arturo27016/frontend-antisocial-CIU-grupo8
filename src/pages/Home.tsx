/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPosts, getCommentsByPost, deletePost } from '../api/api';
import type { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import UserHoverCard from '../components/UserHoverCard';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isLoggedIn } = useAuth();
  

  // Estado global de following para compartir entre todos los PostCard
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [followingLoaded, setFollowingLoaded] = useState(false);

  useEffect(() => {
    getPosts()
      .then(async (fetchedPosts) => {
        setPosts(fetchedPosts);
        const counts: Record<string, number> = {};
        await Promise.all(
          fetchedPosts.map(async (post) => {
            try {
              const comments = await getCommentsByPost(post._id);
              counts[post._id] = comments.length;
            } catch {
              counts[post._id] = 0;
            }
          })
        );
        setCommentCounts(counts);
      })
      .catch(() => setError('No se pudieron cargar las publicaciones.'))
      .finally(() => setLoading(false));
  }, []);

  // Cargar lista de usuarios que sigue el usuario logueado
  useEffect(() => {
    if (!user || followingLoaded) return;
    fetch(`http://localhost:3000/users/${user.nickname}/following`)
      .then((res) => res.json())
      .then((data) => {
        const ids = data.map((f: any) =>
          typeof f.followedId === 'object' ? f.followedId._id : f.followedId
        );
        setFollowingIds(ids);
        setFollowingLoaded(true);
      })
      .catch(() => setFollowingLoaded(true));
  }, [user, followingLoaded]);

  const handleFollowChange = (targetId: string, nowFollowing: boolean) => {
    setFollowingIds((prev) =>
      nowFollowing ? [...prev, targetId] : prev.filter((id) => id !== targetId)
    );
  };

  return (
    <>
      <Navbar />

      {/* Banner de bienvenida */}
      <div
        className="text-white text-center py-5"
        style={{
          background: 'linear-gradient(135deg, #1877f2 0%, #0a58ca 100%)',
        }}
      >
        {isLoggedIn ? (
          <>
            <h2 className="fw-bold display-5">
              ¡Bienvenido de vuelta, {user?.nickname}!
            </h2>
            <p className="lead mb-0">
              ¿Qué está pasando hoy en AntiSocial?
            </p>
          </>
        ) : (
          <>
            <h2 className="fw-bold display-5">Bienvenido a AntiSocial</h2>
          </>
        )}
      </div>

      <div className="container py-4" style={{ maxWidth: 680 }}>
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2 text-muted">Cargando publicaciones...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-muted py-5">
            <p>No hay publicaciones todavía.</p>
          </div>
        )}

        {!loading &&
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              commentCount={commentCounts[post._id] ?? 0}
              currentUserId={user?._id}
              followingIds={followingIds}
              onFollowChange={handleFollowChange}
              onDelete={(postId) => {
                setPosts((prev) => prev.filter((p) => p._id !== postId));
                setCommentCounts((prev) => {
                  const updated = { ...prev };
                  delete updated[postId];
                  return updated;
                });
              }}
            />
          ))}
      </div>
    </>
  );
}

function PostCard({
  post,
  commentCount,
  currentUserId,
  followingIds,
  onFollowChange,
  onDelete,
}: {
  post: Post;
  commentCount: number;
  currentUserId?: string;
  followingIds: string[];
  onFollowChange: (targetId: string, nowFollowing: boolean) => void;
  onDelete: (postId: string) => void;
}) {
  // Si el usuario que creó el post fue eliminado, no renderizamos ese post
  if (!post.userId) {
    return null;
  }

  const tags = post.tags as any[];
  const firstImage = post.images && post.images.length > 0 ? post.images[0] : null;
  const isOwner = typeof post.userId === 'object'
    ? post.userId._id === currentUserId
    : post.userId === currentUserId;

  const handleDelete = async () => {
    if (!confirm('¿Seguro que querés eliminar esta publicación?')) return;
    try {
      await deletePost(post._id);
      onDelete(post._id);
    } catch {
      alert('No se pudo eliminar la publicación.');
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4 rounded-4">
      {firstImage && (
        <img
          src={`http://localhost:3000${firstImage.url}`}
          alt="imagen del post"
          className="card-img-top rounded-top-4"
          style={{ maxHeight: 400, objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      <div className="card-body px-4 py-3">
        {/* Autor y fecha */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <UserHoverCard
            author={post.userId}
            followingIds={followingIds}
            onFollowChange={onFollowChange}
          />
          {post.publishedAt && (
            <p className="text-muted mb-0" style={{ fontSize: '0.78rem' }}>
              {new Date(post.publishedAt).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-2 d-flex flex-wrap gap-1">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="badge rounded-pill"
                style={{ backgroundColor: '#e7f3ff', color: '#1877f2' }}
              >
                #{typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
        )}

        <p className="card-text mb-3" style={{ fontSize: '1rem' }}>
          {post.description}
        </p>

        <hr className="my-2" />

        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            💬 {commentCount} comentario{commentCount !== 1 ? 's' : ''}
          </span>
          <div className="d-flex gap-2">
            {isOwner && (
              <button
                onClick={handleDelete}
                className="btn btn-outline-danger btn-sm px-3 fw-semibold"
              >
                🗑 Eliminar
              </button>
            )}
            <Link
              to={`/post/${post._id}`}
              className="btn btn-primary btn-sm px-3 fw-semibold"
              style={{ backgroundColor: '#1877f2', border: 'none' }}
            >
              Ver más
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}