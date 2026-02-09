# Prueba Técnica – Backend (NestJS)
**Aventura: El Guardián del Onboarding**

API desarrollada en **NestJS** para simular el flujo de onboarding de nuevos clientes:
- Autenticación con **JWT** (válido 5 minutos).
- Catálogo de **productos**.
- Creación de solicitudes de **onboarding** con validaciones (class-validator) y almacenamiento simulado.
- Endpoint de **health check**.

> Nota: Este repositorio no incluye logos ni imágenes de Banco Caja Social.

---

## Requisitos
- Node.js 18+ (recomendado)
- npm 9+
- Linux / WSL recomendado (para evitar problemas de watch en `/mnt/c`)

---

## Instalación y ejecución

```bash
npm install
npm run start:dev
```

La API inicia en:

- `http://localhost:3003`

> Si quieres cambiar el puerto, configura la variable `PORT` en tu `.env` (si aplica).

---

## Credenciales de prueba
Este reto usa credenciales ficticias:

- `username`: `demo`
- `password`: `demo123`

---

## Endpoints

### 1) Health
**GET** `/health`  
Respuesta esperada:

```json
{ "ok": true }
```

Ejemplo:
```bash
curl -s http://localhost:3003/health | jq .
```

---

### 2) Auth (JWT 5 minutos)
**POST** `/auth/login`  
Body:
```json
{
  "username": "demo",
  "password": "demo123"
}
```

Respuesta esperada:
```json
{
  "access_token": "<JWT>",
  "token_type": "Bearer",
  "expires_in": 300
}
```

Ejemplo:
```bash
curl -s -X POST http://localhost:3003/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}' | jq .
```

Guardar token en variable (para pruebas):
```bash
TOKEN=$(curl -s -X POST http://localhost:3003/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}' | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')

echo $TOKEN | cut -c1-40; echo "..."
```

---

### 3) Products
#### 3.1 Listado de productos
**GET** `/products`  
Retorna un array de productos.

Ejemplo:
```bash
curl -s http://localhost:3003/products | jq .
```

#### 3.2 Obtener producto por id
**GET** `/products/:id`  
- Si existe → `200` y objeto producto.
- Si no existe → `404 Not Found`.

Ejemplo (existente):
```bash
curl -s http://localhost:3003/products/cta-digital-001 | jq .
```

Ejemplo (no existe):
```bash
curl -i http://localhost:3003/products/no-existe
```

---

### 4) Onboarding (requiere JWT)
**POST** `/onboarding`  
Requiere header:
- `Authorization: Bearer <token>`

Body:
```json
{
  "fullName": "Juan Perez",
  "documentNumber": "10203040",
  "email": "juan@mail.com",
  "initialAmount": 50000
}
```

Reglas:
- Validación con `class-validator`.
- Almacena con estado `"REQUESTED"` (simulado en memoria).
- Retorna:
```json
{ "onboardingId": "<uuid>", "status": "REQUESTED" }
```

Ejemplo (OK):
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

#### Casos esperados
**Sin token → 401**
```bash
curl -i -X POST http://localhost:3003/onboarding \
  -H "Content-Type: application/json" \
  -d '{"fullName":"X","documentNumber":"123","email":"mal","initialAmount":-1}'
```

**Con token pero datos inválidos → 400**
```bash
curl -i -X POST http://localhost:3003/onboarding \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fullName":"","documentNumber":"abc","email":"mal","initialAmount":-10}'
```

---

## Notas de implementación
- JWT configurado con expiración de **300 segundos (5 min)**.
- `onboardingId` generado como UUID.
- Persistencia simulada **en memoria** (sin base de datos) para efectos del reto.
- Validaciones usando `class-validator` y `ValidationPipe`.

---

## Estructura sugerida del proyecto
- `auth/` → login + generación JWT
- `products/` → catálogo
- `onboarding/` → creación solicitud, validación y almacenamiento simulado
- `health/` → health check


## Autor
Jonathan Ortiz Ruiz
