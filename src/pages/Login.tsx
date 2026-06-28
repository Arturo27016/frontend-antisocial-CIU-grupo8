/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../api/api';

const FIXED_PASSWORD = '123456';

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ya está logueado, redirigir al home
  if (isLoggedIn) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname.trim() || !password.trim()) {
      setError('Completá todos los campos.');
      return;
    }

    if (password !== FIXED_PASSWORD) {
      setError('Contraseña incorrecta.');
      return;
    }

    setLoading(true);
    try {
      const users = await getUsers();
      const found = users.find(
        (u) => u.nickname.toLowerCase() === nickname.trim().toLowerCase()
      );

      if (!found) {
        setError('El usuario no existe.');
        return;
      }

      login(found);
      navigate('/');
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: '#f0f2f5' }}
    >
      <div className="w-100" style={{ maxWidth: 400 }}>
        {/* Logo / título */}
        <div className="text-center mb-4">
          <h1
            className="fw-bold"
            style={{ color: '#1877f2', fontSize: '3rem', letterSpacing: '-1px' }}
          >
            AntiSocial
          </h1>
          <p className="text-muted">
            Conectate con tus conocidos... o no.
          </p>
        </div>

        {/* Card del formulario */}
        <div className="card shadow-sm border-0 p-4">
          {error && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 fw-bold"
              style={{ backgroundColor: '#1877f2', border: 'none' }}
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <hr />

          <div className="text-center">
            <Link
              to="/register"
              className="btn btn-success btn-lg px-4 fw-semibold"
            >
              Crear cuenta nueva
            </Link>
          </div>
        </div>

        <p className="text-center text-muted mt-3" style={{ fontSize: '0.85rem' }}>
          La contraseña para todos los usuarios es{' '}
          <strong>123456</strong>
        </p>
      </div>
    </div>
  );
}
