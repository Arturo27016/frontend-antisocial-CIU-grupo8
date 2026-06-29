/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getPosts, getCommentsByPost, deletePost, getFollowers, getUsers } from '../api/api';
import type { Post, User } from '../types';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [followerCount, setFollowerCount] = useState(0);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      getPosts(),
      getFollowers(user.nickname),
      getUsers(),
    ]).then(async ([allPosts, followers, users]) => {
      const myPosts = allPosts.filter((p) => p.userId._id === user._id);
      setPosts(myPosts);
      setFollowerCount(followers.length);

      // Usuarios que sigue el usuario logueado
      const res = await fetch(`http://localhost:3000/users/${user.nickname}/following`);
      const followingData = res.ok ? await res.json() : [];
      const followingIds = followingData.map((f: any) =>
        typeof f.followedId === 'object' ? f.followedId._id : f.followedId
      );
      setFollowing(followingIds);

      // Todos los usuarios menos yo
      setAllUsers(users.filter((u) => u._id !== user._id));

      const counts: Record<string, number> = {};
      await Promise.all(
        myPosts.map(async (post) => {
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
    .catch(() => setError('Error al cargar el perfil.'))
    .finally(() => setLoading(false));
  }, [user]);

  const handleDeletePost = async (postId: string) => {
    if (!confirm('¿Seguro que querés eliminar esta publicación?')) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setCommentCounts((prev) => {
        const updated = { ...prev };
        delete updated[postId];
        return updated;
      });
    } catch {
      alert('No se pudo eliminar la publicación.');
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-4" style={{ maxWidth: 680 }}>
        {/* Card de perfil */}
        <div
          className="card border-0 shadow-sm rounded-4 mb-4 p-4"
          style={{ backgroundColor: '#1877f2' }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
              style={{
                width: 64,
                height: 64,
                fontSize: '1.8rem',
                backgroundColor: 'rgba(255,255,255,0.25)',
              }}
            >
              {user?.nickname[0].toUpperCase()}
            </div>
            <div>
              <h4 className="fw-bold text-white mb-0">{user?.nickname}</h4>
              <span className="text-white opacity-75" style={{ fontSize: '0.9rem' }}>
                {user?.email}
              </span>
              <div className="d-flex gap-3 mt-1">
                <span className="text-white opacity-75" style={{ fontSize: '0.9rem' }}>
                  📝 {posts.length} publicación{posts.length !== 1 ? 'es' : ''}
                </span>
                <span className="text-white opacity-75" style={{ fontSize: '0.9rem' }}>
                  👥 {followerCount} seguidor{followerCount !== 1 ? 'es' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mis publicaciones */}
        <h5 className="fw-bold mb-3">Mis publicaciones</h5>

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted fs-5">Todavía no publicaste nada.</p>
            <Link
              to="/create-post"
              className="btn btn-primary fw-semibold px-4"
              style={{ backgroundColor: '#1877f2', border: 'none' }}
            >
              Crear primera publicación
            </Link>
          </div>
        )}

        <div className="d-flex flex-column gap-3">
          {!loading &&
            posts.map((post) => (
              <div key={post._id} className="card border-0 shadow-sm rounded-4">
                <div className="card-body px-4 py-3">
                  {/* Tags */}
                  {(post.tags as any[]).length > 0 && (
                    <div className="mb-2 d-flex flex-wrap gap-1">
                      {(post.tags as any[]).map((tag, i) => (
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

                  <p className="card-text mb-2">{post.description}</p>

                  {/* Fecha */}
                  {post.publishedAt && (
                    <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>
                      🕐 {new Date(post.publishedAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                      💬 {commentCounts[post._id] ?? 0} comentario
                      {(commentCounts[post._id] ?? 0) !== 1 ? 's' : ''}
                    </span>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="btn btn-outline-danger btn-sm px-3 fw-semibold"
                      >
                        🗑 Eliminar
                      </button>
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
            ))}
        </div>
      </div>
    </>
  );
}