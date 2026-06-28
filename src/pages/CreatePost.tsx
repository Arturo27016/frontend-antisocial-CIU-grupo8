/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { createPost, getTags } from '../api/api';
import type { Tag } from '../types';

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTags()
      .then(setAvailableTags)
      .catch(() => setAvailableTags([]))
      .finally(() => setTagsLoading(false));
  }, []);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await createPost(user.nickname, {
        description: description.trim(),
      });

      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'No se pudo crear la publicación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-4" style={{ maxWidth: 680 }}>
        {/* Header */}
        <div
          className="card border-0 shadow-sm rounded-4 mb-4 p-4"
          style={{ backgroundColor: '#1877f2' }}
        >
          <h4 className="fw-bold text-white mb-0">✏️ Nueva publicación</h4>
          <p className="text-white opacity-75 mb-0" style={{ fontSize: '0.9rem' }}>
            Publicando como <strong>{user?.nickname}</strong>
          </p>
        </div>

        {/* Formulario */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          {error && (
            <div className="alert alert-danger py-2">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Descripción */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Descripción <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="¿Qué estás pensando?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Etiquetas</label>
              {tagsLoading ? (
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  Cargando etiquetas...
                </p>
              ) : availableTags.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  No hay etiquetas disponibles.
                </p>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const selected = selectedTags.includes(tag._id);
                    return (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => toggleTag(tag._id)}
                        className="btn btn-sm rounded-pill fw-semibold"
                        style={{
                          backgroundColor: selected ? '#1877f2' : '#e7f3ff',
                          color: selected ? '#fff' : '#1877f2',
                          border: 'none',
                          transition: 'all 0.15s',
                        }}
                      >
                        #{tag.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary fw-bold px-4"
                style={{ backgroundColor: '#1877f2', border: 'none' }}
                disabled={loading}
              >
                {loading ? 'Publicando...' : 'Publicar'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary fw-semibold px-4"
                onClick={() => navigate('/profile')}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
