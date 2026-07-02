/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { followUser, unfollowUser, getPosts, getFollowers } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import type { User } from '../types';

interface Props {
  author: User | string;
  followingIds: string[];
  onFollowChange: (targetId: string, nowFollowing: boolean) => void;
}

export default function UserHoverCard({ author, followingIds, onFollowChange }: Props) {
  const { user, isLoggedIn } = useAuth();
  const [show, setShow] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [postCount, setPostCount] = useState<number | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nickname = typeof author === 'object' ? author.nickname : author;
  const authorId = typeof author === 'object' ? author._id : null;
  const isOwnProfile = user?._id === authorId;

  // isFollowing viene del estado del padre, siempre actualizado
  const isFollowing = authorId ? followingIds.includes(authorId) : false;

  useEffect(() => {
    if (!show || dataLoaded || !authorId) return;

    Promise.all([
      getFollowers(nickname),
      getPosts(),
    ]).then(([followers, allPosts]) => {
      setFollowerCount(followers.length);
      const myPosts = allPosts.filter((p) => {
        const uid = typeof p.userId === 'object' ? p.userId._id : p.userId;
        return uid === authorId;
      });
      setPostCount(myPosts.length);
      setDataLoaded(true);
    }).catch(() => {});
  }, [show, dataLoaded, authorId, nickname]);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(true), 400);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(false), 300);
  };

  const handleFollow = async () => {
    if (!user || !authorId) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.nickname, nickname);
        onFollowChange(authorId, false);
        setFollowerCount((prev) => (prev !== null ? prev - 1 : prev));
      } else {
        await followUser(user.nickname, nickname);
        onFollowChange(authorId, true);
        setFollowerCount((prev) => (prev !== null ? prev + 1 : prev));
      }
    } catch {
      alert('No se pudo realizar la acción.');
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div
      className="position-relative d-inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="d-flex align-items-center gap-2" style={{ cursor: 'default' }}>
        <Link
          to={`/user/${nickname}`}
          className="d-flex align-items-center gap-2 text-decoration-none"
        >
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
            {nickname[0].toUpperCase()}
          </div>
          <p className="fw-semibold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>
            {nickname}
          </p>
        </Link>
      </div>

      {show && (
        <div
          className="position-absolute bg-white rounded-4 shadow p-3"
          style={{
            top: '110%',
            left: 0,
            minWidth: 220,
            zIndex: 1000,
            border: '1px solid #e0e0e0',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
              style={{
                width: 48,
                height: 48,
                fontSize: '1.3rem',
                backgroundColor: '#1877f2',
                flexShrink: 0,
              }}
            >
              {nickname[0].toUpperCase()}
            </div>
            <span className="fw-bold" style={{ fontSize: '1rem' }}>
              {nickname}
            </span>
          </div>

          <div className="d-flex gap-3 mb-3">
            <div className="text-center">
              <p className="fw-bold mb-0" style={{ fontSize: '1rem' }}>
                {postCount !== null ? postCount : '...'}
              </p>
              <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                publicaciones
              </p>
            </div>
            <div className="text-center">
              <p className="fw-bold mb-0" style={{ fontSize: '1rem' }}>
                {followerCount !== null ? followerCount : '...'}
              </p>
              <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                seguidores
              </p>
            </div>
          </div>

          {isLoggedIn && !isOwnProfile && (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`btn btn-sm w-100 fw-semibold ${
                isFollowing ? 'btn-outline-secondary' : 'btn-primary'
              }`}
              style={
                !isFollowing ? { backgroundColor: '#1877f2', border: 'none' } : {}
              }
            >
              {followLoading ? '...' : isFollowing ? 'Dejar de seguir' : 'Seguir'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}