# brisa-20-web

Frontend de la invitación Brisa 20. Incluye la invitación pública y el panel privado de respuestas en `/admin/respuestas`.

## Repositorio recomendado

```text
brisa-20-web
```

## Desarrollo local

Requiere Node.js 20 o superior.

```bash
npm ci
cp .env.example .env
npm run dev
```

La configuración local de Vite reenvía `/api/*` a `http://127.0.0.1:3001`. Si la API corre localmente, también puedes usar:

```dotenv
VITE_RSVP_API_URL=/api/rsvps
```

## Variables de Vercel

Configura estas variables en **Project → Settings → Environment Variables**:

```dotenv
VITE_EVENT_DATE=2026-12-12T20:00:00-05:00
VITE_RSVP_API_URL=https://brisa-20-api.vercel.app/api/rsvps
```

`VITE_RSVP_API_URL` puede cambiar si Vercel asigna otro nombre al proyecto API o si utilizas un dominio personalizado.

No pongas credenciales MySQL ni `ADMIN_API_KEY` en este proyecto. Toda variable `VITE_*` forma parte del frontend público.

## Despliegue en Vercel

1. Crea un repositorio Git llamado `brisa-20-web` y sube esta carpeta.
2. En Vercel selecciona **Add New → Project** e importa el repositorio.
3. Vercel detectará Vite automáticamente.
4. Configura las dos variables anteriores para Production.
5. Despliega.

El archivo `vercel.json` ya incluye el fallback SPA necesario para abrir directamente:

```text
https://brisa-20-web.vercel.app/admin/respuestas
```

## Panel privado

El panel solicita la misma `ADMIN_API_KEY` configurada en el proyecto `brisa-20-api`. La clave se introduce al abrir el panel, se conserva únicamente durante la sesión de la pestaña y no se compila dentro del frontend.

## Verificación

```bash
npm run lint
npm run build
```
