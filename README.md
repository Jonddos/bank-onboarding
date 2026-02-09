# Bank Onboarding – Prueba Técnica

Este repositorio contiene mi solución al reto **“El Guardián del Onboarding”**. Lo organicé como un **monorepo** con:

- **Backend (NestJS):** Auth JWT (5 minutos), Products, Onboarding protegido con validaciones y Health.
- **Frontend mínimo (Next.js):** Login, listado de productos y formulario de onboarding para probar el flujo end‑to‑end.
---

## Stack

- Node.js 18+
- NestJS (API)
- Next.js (UI mínima)
- Docker + Docker Compose (opcional pero recomendado)

---

## Estructura del proyecto

```
bank-onboarding/
  backend/
    Dockerfile
    src/
    ...
  frontend/
    Dockerfile
    src/
    ...
  docker-compose.yml
  README.md
```

---

## Puertos

- **Backend:** `http://localhost:3003`
- **Frontend:** `http://localhost:3002`

---

## Variables de entorno

### Frontend

En desarrollo local, el frontend lee:

- `NEXT_PUBLIC_API_BASE_URL` (ejemplo: `http://localhost:3003`)

Archivo sugerido: `frontend/.env.local`

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3003
```

> Si cambias `.env.local`, reinicia `npm run dev` para que Next lo lea.

---

## Ejecución con Docker (recomendada)

### Levantar todo con Docker Compose

Desde la raíz del repositorio:

```bash
docker compose up --build
```

- Frontend: `http://localhost:3002`
- Backend: `http://localhost:3003`
- Health: `http://localhost:3003/health`

### Levantar solo Backend

```bash
docker build -t bank-backend ./backend
docker run --rm -p 3003:3003 bank-backend
```

### Levantar solo Frontend

```bash
docker build -t bank-frontend ./frontend
docker run --rm -p 3002:3002 bank-frontend
```

> El frontend consume la API desde el navegador (host). Por eso en Docker se recomienda exponer el backend en `localhost:3003`.

---

## Ejecución local (sin Docker)

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend disponible en: `http://localhost:3003`

### Frontend

```bash
cd frontend
npm install
npm run dev -- -p 3002
```

Frontend disponible en: `http://localhost:3002`

---

## Endpoints (Backend)

### 1) Health

`GET /health`

Respuesta:

```json
{ "ok": true }
```

### 2) Auth

`POST /auth/login`

Body:

```json
{ "username": "demo", "password": "demo123" }
```

Respuesta:

```json
{
  "access_token": "JWT",
  "token_type": "Bearer",
  "expires_in": 300
}
```

- El token expira en **5 minutos**.

### 3) Products

- `GET /products` → lista de productos
- `GET /products/:id` → producto por id o 404

### 4) Onboarding

`POST /onboarding` (protegido con JWT)

Headers:

- `Authorization: Bearer <token>`
- `Content-Type: application/json`

Body:

```json
{
  "fullName": "Juan Perez",
  "documentNumber": "10203040",
  "email": "juan@mail.com",
  "initialAmount": 50000
}
```

Comportamiento:

- Valida con `class-validator`
- “Guarda” la solicitud con estado `"REQUESTED"` (simulado en memoria)
- Retorna:

```json
{ "onboardingId": "uuid", "status": "REQUESTED" }
```

---

## Pruebas rápidas con curl

### Health

```bash
curl -s http://localhost:3003/health | jq .
```

### Login + token en variable

```bash
TOKEN=$(curl -s -X POST http://localhost:3003/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}' \
  | sed -n 's/.*"access_token":"\([^\"]*\)".*/\1/p')

echo $TOKEN | cut -c1-40; echo "..."
```

### Products

```bash
curl -s http://localhost:3003/products | jq .
curl -s http://localhost:3003/products/cta-digital-001 | jq .
curl -i http://localhost:3003/products/no-existe
```

### Onboarding OK (con token)

```bash
curl -s -X POST http://localhost:3003/onboarding \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fullName":"Juan Perez",
    "documentNumber":"10203040",
    "email":"juan@mail.com",
    "initialAmount":50000
  }' | jq .
```

### Onboarding sin token (401)

```bash
curl -i -X POST http://localhost:3003/onboarding \
  -H "Content-Type: application/json" \
  -d '{"fullName":"X","documentNumber":"123","email":"mal","initialAmount":-1}'
```

### Validaciones (400)

```bash
curl -i -X POST http://localhost:3003/onboarding \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fullName":"","documentNumber":"abc","email":"mal","initialAmount":-10}'
```

---

## Frontend (demo mínima)

El frontend está pensado para demostrar el reto sin depender de herramientas externas:

1. **Login**: obtiene JWT desde `POST /auth/login`
2. **Products**: consulta `GET /products` y permite navegar
3. **Onboarding**: envía `POST /onboarding` con `Authorization: Bearer <token>`

Rutas típicas:

- `/` → login
- `/products` → listado
- `/onboarding` → formulario

> Si el token expira (5 min), el backend responde `401 Unauthorized` y se debe iniciar sesión de nuevo.

---

## Notas de implementación

- Persistencia: se simula el almacenamiento (in‑memory) para cumplir con el enunciado.
- Validaciones: DTOs + `class-validator`.
- Seguridad: el endpoint `/onboarding` está protegido con JWT.

---

## Autor

implementacion realizada por Jonathan Ortiz Ruiz