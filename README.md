# CrArc

Aplicación móvil para registrar, planificar y dar seguimiento a tus rutinas de entrenamiento en el gimnasio.

CrArc te permite crear tus propias rutinas (workouts), asignarles ejercicios, ejecutar sesiones de entrenamiento con registro de series, repeticiones y peso, llevar un historial de progreso por ejercicio y consultar estadísticas de rendimiento. Todo funciona sin conexión a internet — tus datos viven en tu dispositivo.

---

## Infraestructura

### Stack principal

| Capa | Tecnología | Decisión |
|------|-----------|----------|
| **Runtime** | React Native 0.83 + Expo 55 | Desarrollo móvil nativo con herramientas simplificadas |
| **Navegación** | Expo Router (file-based) | Rutas tipadas, lazy loading por segmento, deep linking nativo |
| **Estilos** | Uniwind (Tailwind v4) + HeroUI Native | Sistema de diseño utilitario + componentes accesibles preconstruidos |
| **Estado remoto** | TanStack Query | Caché, refetch automático y mutaciones optimistas |
| **Estado local** | Zustand | Estado global ligero sin boilerplate |
| **Persistencia** | expo-sqlite + Drizzle ORM | Base de datos SQLite local, esquemas tipados, migraciones |
| **Validación** | Zod + TanStack Form | Schemas en runtime y formularios reactivos con validación integrada |
| **Gestor de paquetes** | Bun | Instalación rápida, scripts nativos TypeScript sin compilador externo |
| **Build** | EAS Build | Builds nativas cloud para Android e iOS |

### Arquitectura de código

El proyecto sigue **Clean Architecture (hexagonal)** con separación clara por capas:

```
src/core/<módulo>/
├── domain/          # Entidades y reglas de negocio puras
├── application/     # Casos de uso (commands + queries + hooks)
│   ├── actions/
│   │   ├── commands/   # Escritura (CQRS)
│   │   └── queries/    # Lectura (CQRS)
│   └── hooks/          # Hooks React (consumen queries/commands)
└── presentation/    # Componentes, pantallas y UI
    ├── screens/
    ├── sections/
    └── components/
```

**Módulos del dominio:**
- `exercises` — catálogo de ejercicios con búsqueda y filtros
- `workouts` — creación y gestión de rutinas con ejercicios asignados
- `workout-sessions` — sesiones activas, registro de series, descanso
- `profile` — configuración de usuario y preferencias (unidades de peso)

**Decisiones de diseño:**
- CQRS simple (no event sourcing): separación estricta entre comandos (mutaciones) y queries (lecturas)
- UI declarativa: cada pantalla es una función pura que recibe datos via hooks — sin lógica de negocio en componentes visuales
- Offline-first: SQLite local como fuente de verdad, sin dependencia de backend
- Drizzle sobre SQLite directo (sin ORMs pesados que requieran servidor)

---

## Iniciar el proyecto

### Requisitos previos

- **Bun** (última versión estable)
- **Expo Go** instalado en tu dispositivo físico, **o** un emulador Android/iOS configurado

### Instalación

```bash
bun install
```

### Ejecutar en desarrollo

```bash
# Iniciar servidor Metro
bun dev

# Escanear QR con Expo Go (Android/iOS)
bun start

# Ejecutar en emulador Android
bun android

# Ejecutar en emulador iOS
bun ios

# Ejecutar en web
bun web
```

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `bun dev` | Inicia Metro con caché limpia |
| `bun start` | Inicia Metro (modo normal) |
| `bun android` | Abre en emulador/conexión Android |
| `bun ios` | Abre en emulador iOS |
| `bun web` | Ejecuta versión web |
| `bun lint` | Ejecuta ESLint en todo el proyecto |
| `bun build:dev` | Build nativa de desarrollo (EAS cloud) |
| `bun build:prev` | Build nativa de preview (EAS cloud) |
| `bun build:dev:local` | Build nativa de desarrollo (local) |
| `bun build:prev:local` | Build nativa de preview (local) |
