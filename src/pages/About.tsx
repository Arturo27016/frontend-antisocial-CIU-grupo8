import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <div
        className="text-white text-center py-5"
        style={{
          background: 'linear-gradient(135deg, #1877f2 0%, #0a58ca 100%)',
        }}
      >
        <h1 className="fw-bold display-4 mb-3">AntiSocial Net</h1>
        <p className="lead mb-0" style={{ maxWidth: 600, margin: '0 auto' }}>
          La red social que no pediste, pero que de alguna forma terminaste usando.
        </p>
      </div>

      <div className="container py-5" style={{ maxWidth: 720 }}>

        {/* Sobre el proyecto */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h3 className="fw-bold mb-3" style={{ color: '#1877f2' }}>
            ¿Qué es AntiSocial Net?
          </h3>
          <p className="text-muted mb-0" style={{ lineHeight: 1.8 }}>
            AntiSocial Net es una red social desarrollada como Trabajo Práctico N°2
            de la materia <strong>Construcción de Interfaces de Usuario</strong> de la
            Universidad Nacional de Hurlingham (<strong>UNaHur</strong>). El proyecto
            consiste en un frontend en React que consume una API REST desarrollada en
            la materia <strong>Estrategias de Persistencia</strong>. Aunque el nombre
            sugiere lo contrario, el objetivo es conectar personas... o al menos intentarlo.
          </p>
        </div>

        {/* Tecnologías */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h3 className="fw-bold mb-4" style={{ color: '#1877f2' }}>
            Tecnologías utilizadas
          </h3>
          <div className="row g-3">
            {[
              { icon: '⚛️', name: 'React 19', desc: 'Librería principal de UI' },
              { icon: '🔷', name: 'TypeScript', desc: 'Tipado estático' },
              { icon: '⚡', name: 'Vite', desc: 'Bundler y servidor de desarrollo' },
              { icon: '🎨', name: 'Bootstrap 5', desc: 'Framework de estilos' },
              { icon: '🔀', name: 'React Router v7', desc: 'Navegación entre vistas' },
              { icon: '🌐', name: 'Fetch API', desc: 'Consumo de la API REST' },
              { icon: '🗄️', name: 'Node.js + Express', desc: 'Backend de la API' },
              { icon: '🍃', name: 'MongoDB + Mongoose', desc: 'Base de datos' },
              { icon: '🐳', name: 'Docker', desc: 'Contenedorización del backend' },
            ].map((tech) => (
              <div key={tech.name} className="col-6 col-md-4">
                <div
                  className="d-flex align-items-center gap-2 p-3 rounded-4"
                  style={{ backgroundColor: '#f0f2f5' }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{tech.icon}</span>
                  <div>
                    <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem' }}>
                      {tech.name}
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                      {tech.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funcionalidades */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h3 className="fw-bold mb-4" style={{ color: '#1877f2' }}>
            Funcionalidades
          </h3>
          <div className="d-flex flex-column gap-2">
            {[
              '✅ Registro e inicio de sesión simulado',
              '✅ Feed de publicaciones con imágenes y etiquetas',
              '✅ Comentarios en publicaciones',
              '✅ Creación de publicaciones con imagen y tags',
              '✅ Perfil de usuario con sus publicaciones',
              '✅ Seguir y dejar de seguir usuarios',
              '✅ Eliminar publicaciones propias',
              '✅ Eliminar cuenta',
              '✅ Rutas protegidas para usuarios logueados',
              '✅ Persistencia de sesión con localStorage',
            ].map((feat) => (
              <p key={feat} className="mb-0" style={{ fontSize: '0.95rem' }}>
                {feat}
              </p>
            ))}
          </div>
        </div>

        {/* Equipo */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h3 className="fw-bold mb-4" style={{ color: '#1877f2' }}>
            Equipo de desarrollo
          </h3>
          <div className="d-flex flex-wrap gap-3">
            {['Arturo Juan Deandrea'].map((name) => (
              <div
                key={name}
                className="d-flex align-items-center gap-3 p-3 rounded-4"
                style={{ backgroundColor: '#f0f2f5', minWidth: 180 }}
              >
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
                  {name[0]}
                </div>
                <div>
                  <p className="fw-bold mb-0">{name}</p>
                  <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                    Desarrollador
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-3">
          <p className="text-muted mb-3">
            ¿Querés ser parte de la comunidad más anti-social de internet?
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link
              to="/register"
              className="btn btn-primary fw-semibold px-4"
              style={{ backgroundColor: '#1877f2', border: 'none' }}
            >
              Crear cuenta
            </Link>
            <Link
              to="/"
              className="btn btn-outline-primary fw-semibold px-4"
              style={{ color: '#1877f2', borderColor: '#1877f2' }}
            >
              Ver publicaciones
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}