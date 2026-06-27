/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPostById, createComment } from '../api/api';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPostById(id)
      .then(setPost)
      .catch(() => setError('No se pudo cargar la publicación.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError('');
    setCommentSuccess(false);

    if (!commentContent.trim()) {
      setCommentError('El comentario no puede estar vacío.');
      return;
    }

    if (!user || !id) return;

    setCommentLoading(true);
    try {
      const newComment = await createComment(id, {
        content: commentContent.trim(),
        userId: user._id,
      });

      // Agregamos el comentario nuevo al estado local
      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [...(prev.comments ?? []), newComment],
        };
      });

      setCommentContent('');
      setCommentSuccess(true);
    } catch {
      setCommentError('No se pudo enviar el comentario.');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Cargando publicación...</p>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="alert alert-danger">{error || 'Post no encontrado.'}</div>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </>
    );
  }

  const tags = post.tags as any[];

  return (
    <>
      <Navbar />

      <div className="container py-4" style={{ maxWidth: 680 }}>
        {/* Card del post */}
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          {/* Imágenes */}
          {post.images && post.images.length > 0 && (
            <div>
              {post.images.map((img) => (
                <img
                  key={img._id}
                  src={`http://localhost:3000/${img.url}`}
                  alt="imagen"
                  className="card-img-top rounded-top-4"
                  style={{ maxHeight: 450, objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ))}
            </div>
          )}

          <div className="card-body px-4 py-3">
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mb-3 d-flex flex-wrap gap-1">
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
            <p className="card-text fs-5">{post.description}</p>

            <Link to="/" className="text-decoration-none" style={{ color: '#1877f2' }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>

        {/* Sección comentarios */}
        <h5 className="fw-bold mb-3">
          💬 Comentarios ({post.comments?.length ?? 0})
        </h5>

        {post.comments && post.comments.length > 0 ? (
          <div className="d-flex flex-column gap-3 mb-4">
            {post.comments.map((comment) => (
              <div
                key={comment._id}
                className="card border-0 rounded-4"
                style={{ backgroundColor: '#f0f2f5' }}
              >
                <div className="card-body py-2 px-3">
                  <p className="mb-0">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted mb-4">Todavía no hay comentarios.</p>
        )}

        {/* Formulario para comentar */}
        {isLoggedIn ? (
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <h6 className="fw-semibold mb-3">Dejá tu comentario</h6>

            {commentError && (
              <div className="alert alert-danger py-2">{commentError}</div>
            )}
            {commentSuccess && (
              <div className="alert alert-success py-2">¡Comentario enviado!</div>
            )}

            <form onSubmit={handleComment}>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Escribí algo..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary fw-semibold"
                style={{ backgroundColor: '#1877f2', border: 'none' }}
                disabled={commentLoading}
              >
                {commentLoading ? 'Enviando...' : 'Comentar'}
              </button>
            </form>
          </div>
        ) : (
          <div className="alert alert-light border text-center">
            <Link to="/login" style={{ color: '#1877f2' }} className="fw-semibold">
              Iniciá sesión
            </Link>{' '}
            para dejar un comentario.
          </div>
        )}
      </div>
    </>
  );
}