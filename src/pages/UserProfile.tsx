/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPosts, getFollowers, getCommentsByPost, followUser, unfollowUser, getUsers } from '../api/api';
import { useAuth } from '../context/AuthContext';
import type { Post, User } from '../types';

export default function UserProfile() {
  const { nickname } = useParams<{ nickname: string }>();
  const { user, isLoggedIn } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = user?.nickname.toLowerCase() === nickname?.toLowerCase();

  useEffect(() => {
    if (!nickname) return;

    Promise.all([
      getUsers(),
      getPosts(),
    ]).then(async ([allUsers, allPosts]) => {
      // Encontrar el usuario por nickname
      const found = allUsers.find(
        (u) => u.nickname.toLowerCase() === nickname.toLowerCase()
      );

      if (!found) {
        setError('Usuario no encontrado.');
        return;
      }

      setProfileUser(found);

      // Posts del usuario
      const userPosts = allPosts.filter((p) => {
        if (!p.userId) return false;
        const uid = typeof p.userId === 'object' ? p.userId._id : p.userId;
        return uid === found._id;
      });
      setPosts(userPosts);

      // Seguidores y siguiendo
      const [followers, followingList] = await Promise.all([
        getFollowers(found.nickname),
        fetch(`http://localhost:3000/users/${found.nickname}/following`)
          .then((res) => res.json())
          .catch(() => []),
      ]);
      setFollowerCount(followers.length);
      setFollowingCount(followingList.length);

      // ¿El usuario logueado ya sigue a este perfil?
      if (user && !isOwnProfile) {
        const myFollowing = await fetch(
          `http://localhost:3000/users/${user.nickname}/following`
        )
          .then((res) => res.json())
          .catch(() => []);
        const ids = myFollowing.map((f: any) =>
          typeof f.followedId === 'object' ? f.followedId._id : f.followedId
        );
        setIsFollowing(ids.includes(found._id));
      }

      // Contador de comentarios
      const counts: Record<string, number> = {};
      await Promise.all(
        userPosts.map(async (post) => {
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
  }, [nickname, user, isOwnProfile]);

  const handleFollow = async () => {
    if (!user || !profileUser) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.nickname, profileUser.nickname);
        setIsFollowing(false);
        setFollowerCount((prev) => prev - 1);
      } else {
        await followUser(user.nickname, profileUser.nickname);
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch {
      alert('No se pudo realizar la acción.');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Cargando perfil...</p>
        </div>
      </>
    );
  }

  if (error || !profileUser) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="alert alert-danger">{error || 'Usuario no encontrado.'}</div>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container py-4" style={{ maxWidth: 680 }}>
        {/* Card de perfil */}
        <div
          className="card border-0 shadow-sm rounded-4 mb-4 p-4"
          style={{ backgroundColor: '#1877f2' }}
        >
          <div className="d-flex align-items-center justify-content-between">
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
                {profileUser.nickname[0].toUpperCase()}
              </div>
              <div>
                <h4 className="fw-bold text-white mb-0">{profileUser.nickname}</h4>
                <div className="d-flex gap-3 mt-1">
                  <span className="text-white opacity-75" style={{ fontSize: '0.9rem' }}>
                    📝 {posts.length} publicación{posts.length !== 1 ? 'es' : ''}
                  </span>
                  <span className="text-white opacity-75" style={{ fontSize: '0.9rem' }}>
                    👥 {followerCount} seguidor{followerCount !== 1 ? 'es' : ''}
                  </span>
                  <span className="text-white opacity-75" style={{ fontSize: '0.9rem' }}>
                    ➡️ {followingCount} siguiendo
                  </span>
                </div>
              </div>
            </div>

            {/* Botón seguir - solo si no es tu propio perfil */}
            {isLoggedIn && !isOwnProfile && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`btn fw-semibold px-4 ${
                  isFollowing ? 'btn-outline-light' : 'btn-light'
                }`}
                style={!isFollowing ? { color: '#1877f2' } : {}}
              >
                {followLoading
                  ? '...'
                  : isFollowing
                  ? 'Dejar de seguir'
                  : 'Seguir'}
              </button>
            )}

            {/* Si es tu propio perfil, redirigir al perfil privado */}
            {isOwnProfile && (
              <Link
                to="/profile"
                className="btn btn-light fw-semibold"
                style={{ color: '#1877f2' }}
              >
                Mi perfil
              </Link>
            )}
          </div>
        </div>

        {/* Posts del usuario */}
        <h5 className="fw-bold mb-3">Publicaciones</h5>

        {posts.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted">Este usuario todavía no publicó nada.</p>
          </div>
        )}

        <div className="d-flex flex-column gap-3">
          {posts.map((post) => (
            <div key={post._id} className="card border-0 shadow-sm rounded-4">
              {/* Imagen */}
              {post.images && post.images.length > 0 && (
                <img
                  src={`http://localhost:3000${post.images[0].url}`}
                  alt="imagen"
                  className="card-img-top rounded-top-4"
                  style={{ maxHeight: 300, objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
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

                {post.publishedAt && (
                  <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>
                    🕐 {new Date(post.publishedAt).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    💬 {commentCounts[post._id] ?? 0} comentario
                    {(commentCounts[post._id] ?? 0) !== 1 ? 's' : ''}
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
          ))}
        </div>
      </div>
    </>
  );
}