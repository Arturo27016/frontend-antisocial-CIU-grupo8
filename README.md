# UnaHur Anti-Social – Frontend

Frontend de la red social **Anti-Social**, desarrollado en React con TypeScript como parte del Trabajo Práctico N°2 de la materia Construcción de Interfaces de Usuario (CIU) de la Universidad Nacional de Hurlingham (UNaHur).

## Descripción

AntiSocial es una red social que permite a los usuarios registrarse, publicar contenido, comentar, seguir a otros usuarios y gestionar su perfil. El frontend consume una API REST desarrollada en la materia Estrategias de Persistencia.

## Tecnologías utilizadas

- React con TypeScript
- Vite
- Bootstrap
- React Router
- Fetch API
- Context API y localStorage para manejo de sesión

## Funcionalidades

- Registro e inicio de sesión simulado con contraseña fija
- Feed de publicaciones con imágenes y etiquetas
- Detalle de publicación con comentarios
- Creación de publicaciones con imagen y etiquetas
- Perfil de usuario con sus publicaciones y estadísticas
- Seguir y dejar de seguir usuarios
- Visitar el perfil público de otros usuarios
- Eliminar publicaciones propias
- Eliminar cuenta
- Rutas protegidas para usuarios logueados
- Persistencia de sesión con localStorage

## Requisitos previos

- Node.js instalado
- El backend corriendo localmente con Docker

## Instrucciones para correr en local

### 1 — Levantar el backend

Clonar el repositorio del backend y ejecutar en su carpeta:

```bash
docker-compose up
```

La API quedará disponible en `http://localhost:3000`.


### 2 — Levantar el frontend

Clonar el repositorio del front, instalar las dependencias y levantar el servidor de desarrollo:

```bash
npm install
npm run dev
```

El frontend quedará disponible en `http://localhost:5173`.

## Repositorios

- Frontend: https://github.com/Arturo27016/frontend-antisocial-CIU-grupo8
- Backend: https://github.com/Arturo27016/backend-antisocial

## Integrantes

- Arturo Juan Deandrea - Comisión 2
