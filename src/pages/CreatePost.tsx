/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { addTagToPost, createPost, getTags, uploadPostImage } from '../api/api';
import type { Tag } from '../types';

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    const newPost = await createPost(user.nickname, {
      description: description.trim(),
    });

    await Promise.all([
      ...(imageFile ? [uploadPostImage(newPost._id, imageFile)] : []),
      ...selectedTags.map((tagId) => addTagToPost(newPost._id, tagId)),
    ]);

    setSuccess(true);
    setTimeout(() => navigate('/profile'), 2000);
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
          {success && (
            <div
              className="alert alert-success d-flex align-items-center gap-2 py-3"
              role="alert"
            >
              <span style={{ fontSize: '1.2rem' }}>✅</span>
              <div>
                <strong>¡Publicación creada!</strong>
                <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                  Te redirigimos a tu perfil en un momento...
                </p>
              </div>
            </div>
          )}

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

            {/* Imagen */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Imagen (opcional)</label>

              {imagePreview ? (
                <div className="position-relative">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="rounded-4 w-100"
                    style={{ maxHeight: 300, objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle fw-bold"
                    style={{ width: 32, height: 32, lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  className="border rounded-4 d-flex flex-column align-items-center justify-content-center py-4 text-muted"
                  style={{ cursor: 'pointer', borderStyle: 'dashed !important', backgroundColor: '#f8f9fa' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span style={{ fontSize: '2rem' }}>📷</span>
                  <span style={{ fontSize: '0.9rem' }}>Hacé click para subir una imagen</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleImageChange}
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
                disabled={loading || success}
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
