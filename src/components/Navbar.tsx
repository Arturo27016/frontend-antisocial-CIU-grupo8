import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm sticky-top"
      style={{ backgroundColor: '#1877f2' }}
    >
      <div className="container">
        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand fw-bold text-white"
          style={{ fontSize: '1.6rem', letterSpacing: '-0.5px' }}
        >
          AntiSocial
        </Link>

        {/* Botón hamburguesa mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          style={{ filter: 'invert(1)' }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Links izquierda */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white fw-semibold">
                Inicio
              </Link>
            </li>
          </ul>

          {/* Derecha */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-2">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/create-post"
                    className="btn btn-light btn-sm fw-semibold px-3"
                    style={{ color: '#1877f2' }}
                  >
                    + Nueva publicación
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link text-white fw-semibold">
                    👤 {user?.nickname}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm fw-semibold"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-white fw-semibold">
                    Iniciar sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="btn btn-light btn-sm fw-semibold px-3"
                    style={{ color: '#1877f2' }}
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}