import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPosts } from '../api/api';
import type { Post } from '../types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPosts()
      .then(setPosts)
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
            <PostCard key={post._id} post={post} />
          ))}
      </div>
    </>
  );
}

function PostCard({ post }: { post: Post }) {
  const tags = post.tags as any[];
  const commentCount = post.comments?.length ?? 0;

  // Tomamos la primera imagen si existe
  const firstImage =
    post.images && post.images.length > 0 ? post.images[0] : null;

  return (
    <div className="card shadow-sm border-0 mb-4 rounded-4">
      {/* Imagen del post */}
      {firstImage && (
        <img
          src={`http://localhost:3000/${firstImage.url}`}
          alt="imagen del post"
          className="card-img-top rounded-top-4"
          style={{ maxHeight: 400, objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      <div className="card-body px-4 py-3">
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