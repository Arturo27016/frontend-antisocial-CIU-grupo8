/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPosts, getCommentsByPost } from '../api/api';
import type { Post, Comment } from '../types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPosts()
      .then(async (fetchedPosts) => {
        setPosts(fetchedPosts);

        // Traemos los comentarios de cada post en paralelo
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
        <h2 className="fw-bold display-5">Bienvenido a AntiSocial Net</h2>
        <p className="lead mb-0">
          La red social donde nadie quiere estar... pero todos están.
        </p>
      </div>

      {/* Feed */}
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
            />
          ))}
      </div>
    </>
  );
}

function PostCard({
  post,
  commentCount,
}: {
  post: Post;
  commentCount: number;
}) {
  const tags = post.tags as any[];
  const firstImage = post.images && post.images.length > 0 ? post.images[0] : null;
  const author = typeof post.userId === 'object' ? post.userId.nickname : 'Usuario';

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
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
            style={{
              width: 40,
              height: 40,
              fontSize: '1rem',
              backgroundColor: '#1877f2',
              flexShrink: 0,
            }}
          >
            {author[0].toUpperCase()}
          </div>
          <div>
            <p className="fw-semibold mb-0" style={{ fontSize: '0.95rem' }}>
              {author}
            </p>
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

        {/* Descripción */}
        <p className="card-text mb-3" style={{ fontSize: '1rem' }}>
          {post.description}
        </p>

        <hr className="my-2" />

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            💬 {commentCount} comentario{commentCount !== 1 ? 's' : ''}
          </span>
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
  );
}