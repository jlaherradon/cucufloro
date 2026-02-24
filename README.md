# Parking Swap Frontend

Frontend MVP en Next.js 15 (App Router) para consumir backend Spring Boot con JWT.

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
```

## Configuración de entorno

Crear `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Ejecutar en local

```bash
npm run dev
```

App en: `http://localhost:3000`

## Build producción

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev`: entorno desarrollo
- `npm run build`: build producción
- `npm run start`: correr build
- `npm run lint`: lint con Next ESLint
- `npm run format`: formatear con Prettier

## Estructura

- `src/app/(auth)/*`: login/register
- `src/app/(app)/*`: rutas privadas (dashboard, spot, preferences, matches, chat)
- `src/lib/api.ts`: cliente API central (axios + JWT)
- `src/lib/auth.ts`: helpers de auth + mapper central de respuesta
- `src/store/auth.ts`: store mínimo con Zustand
- `src/components/map-picker.tsx`: selector de lat/lon reutilizable
- `src/types/dtos.ts`: tipos DTO
