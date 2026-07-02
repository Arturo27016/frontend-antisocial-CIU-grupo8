/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../api/api';

export default function Register() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Completá todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await createUser({ nickname: nickname.trim(), email: email.trim(), password });
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'No se pudo crear el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: '#f0f2f5' }}
    >
      <div className="w-100" style={{ maxWidth: 432 }}>
        {/* Logo / título */}
        <div className="text-center mb-4">
          <h1
            className="fw-bold"
            style={{ color: '#1877f2', fontSize: '3rem', letterSpacing: '-1px' }}
          >
            AntiSocial
          </h1>
          <p className="text-muted">Creá tu cuenta.</p>
        </div>

        {/* Card */}
        <div className="card shadow-sm border-0 p-4">
          <h4 className="fw-bold mb-1">Crear cuenta nueva</h4>
          <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
            Es rápido y fácil.
          </p>

          {error && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success btn-lg w-100 fw-bold"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <hr />

          <div className="text-center">
            <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#1877f2' }}>
              ¿Ya tenés cuenta? Iniciá sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
