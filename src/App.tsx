import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './router/ProtectedRoute';

import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import PostDetail from './pages/PostDetail.tsx';
import Profile from './pages/Profile.tsx';
import CreatePost from './pages/CreatePost.tsx';
import About from './pages/About.tsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/about" element={<About />} />

          {/* Rutas protegidas */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          {/* Cualquier ruta desconocida va al home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}