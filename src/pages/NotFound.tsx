import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: '#f0f2f5' }}
      >
        <div className="text-center">
          <h1
            className="fw-bold mb-0"
            style={{ fontSize: '6rem', color: '#1877f2' }}
          >
            404
          </h1>
          <h4 className="fw-bold mb-2">Página no encontrada</h4>
          <p className="text-muted mb-4">
            La ruta que ingresaste no existe en AntiSocial.
          </p>
          <Link
            to="/"
            className="btn btn-primary fw-semibold px-4"
            style={{ backgroundColor: '#1877f2', border: 'none' }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </>
  );
}