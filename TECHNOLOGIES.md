# 🛠️ Tecnologías del Proyecto

Este documento describe todas las tecnologías, frameworks, librerías y herramientas utilizadas en el proyecto **Transactions-comercials**.

---

## 📋 Tabla de Contenidos

- [Stack Principal](#-stack-principal)
- [Backend](#-backend)
- [Frontend](#-frontend)
- [Base de Datos](#-base-de-datos)
- [Infraestructura](#-infraestructura)
- [Herramientas de Desarrollo](#-herramientas-de-desarrollo)

---

## 🎯 Stack Principal

El proyecto está construido sobre un stack moderno y eficiente:

- **Runtime:** Bun (v1.1.18+)
- **Lenguaje:** TypeScript 5.x
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Arquitectura:** Cliente-Servidor (Frontend + Backend separados)

---

## 🔧 Backend

### Runtime y Framework

- **[Bun](https://bun.sh/)** - Runtime de JavaScript ultra-rápido, alternativa a Node.js
  - Versión: 1.1.18+
  - Usado para ejecutar el servidor y gestionar dependencias

- **[Express.js](https://expressjs.com/)** (v5.1.0) - Framework web minimalista para Node.js
  - Manejo de rutas y middleware
  - API RESTful

### ORM y Base de Datos

- **[Prisma](https://www.prisma.io/)** (v6.14.0) - ORM moderno para TypeScript
  - `@prisma/client` - Cliente generado para acceso a base de datos
  - Migraciones de base de datos
  - Type-safe database queries

### Autenticación y Seguridad

- **[JSON Web Tokens (JWT)](https://jwt.io/)** (v9.0.2) - Autenticación basada en tokens
  - `jsonwebtoken` - Generación y verificación de tokens
  - `@types/jsonwebtoken` - Tipos de TypeScript

- **[bcrypt](https://www.npmjs.com/package/bcrypt)** (v6.0.0) - Hashing de contraseñas
  - `@types/bcrypt` - Tipos de TypeScript

### Middleware

- **[CORS](https://www.npmjs.com/package/cors)** (v2.8.5) - Control de acceso entre orígenes
  - `@types/cors` - Tipos de TypeScript

- **[cookie-parser](https://www.npmjs.com/package/cookie-parser)** (v1.4.7) - Parsing de cookies
  - `@types/cookie-parser` - Tipos de TypeScript

### Lenguaje

- **[TypeScript](https://www.typescriptlang.org/)** (v5.x) - Superset tipado de JavaScript
  - `@types/bun` - Tipos específicos de Bun
  - `@types/express` - Tipos para Express

---

## 🎨 Frontend

### Framework y Build Tool

- **[React](https://react.dev/)** (v19.1.1) - Biblioteca para construir interfaces de usuario
  - `react-dom` (v19.1.1) - Renderizado del DOM
  - `@types/react` (v19.1.10) - Tipos de TypeScript
  - `@types/react-dom` (v19.1.7) - Tipos de TypeScript

- **[Vite](https://vite.dev/)** (v7.1.2) - Build tool y dev server ultra-rápido
  - `@vitejs/plugin-react-swc` (v4.0.0) - Plugin de React con SWC compiler

### Estilos

- **[Tailwind CSS](https://tailwindcss.com/)** (v4.1.12) - Framework CSS utility-first
  - `@tailwindcss/vite` (v4.1.12) - Plugin de Vite para Tailwind
  
- **[DaisyUI](https://daisyui.com/)** (v5.0.50) - Biblioteca de componentes para Tailwind CSS
  - Componentes preconstruidos y personalizables

### Routing

- **[React Router DOM](https://reactrouter.com/)** (v7.8.1) - Routing declarativo para React
  - Navegación entre páginas
  - Manejo de rutas dinámicas

### Gestión de Estado

- **[Zustand](https://zustand-demo.pmnd.rs/)** (v5.0.8) - Solución minimalista de gestión de estado
  - Estado global simple y eficiente
  - Sin boilerplate

### Formularios

- **[React Hook Form](https://react-hook-form.com/)** (v7.62.0) - Validación de formularios performante
  - Validación basada en hooks
  - Mínimo re-renders

### HTTP Client

- **[Axios](https://axios-http.com/)** (v1.11.0) - Cliente HTTP basado en promesas
  - Peticiones a la API del backend
  - Interceptores de request/response

### UI/UX

- **[SweetAlert2](https://sweetalert2.github.io/)** (v11.22.4) - Modales y alertas bonitas
  - Notificaciones y confirmaciones
  - Altamente personalizable

- **[Lucide React](https://lucide.dev/)** (v0.540.0) - Iconos SVG modernos
  - Iconos React components
  - Ligeros y personalizables

### Lenguaje

- **[TypeScript](https://www.typescriptlang.org/)** (~5.8.3) - Tipado estático para JavaScript

---

## 🗄️ Base de Datos

### Sistema de Base de Datos

- **[PostgreSQL](https://www.postgresql.org/)** - Sistema de gestión de base de datos relacional
  - Base de datos principal del proyecto
  - Usado a través de Docker Compose

### Herramientas de Base de Datos

- **[Prisma](https://www.prisma.io/)** - ORM y migration tool
  - Schema definition
  - Migrations automáticas
  - Type-safe queries

### Esquema de Base de Datos

El proyecto incluye las siguientes tablas principales:
- `categories` y `subcategories` - Categorización de productos
- `products` - Catálogo de productos
- `suppliers` y `supplier_contacts` - Gestión de proveedores
- `quotes` y `quote_details` - Cotizaciones
- `buy_orders` y `buy_order_details` - Órdenes de compra
- `purchase` y `purchase_details` - Compras
- `retaceo` y `retaceo_details` - Proceso de retaceo (prorrateo de costos)
- `price_analysis` y `price_analysis_details` - Análisis de precios
- `price` y `price_history` - Gestión de precios
- `order_log` - Bitácora de gastos
- `expense_types` - Tipos de gastos
- `accounts` - Cuentas de usuario
- `vendors` - Vendedores
- `clients` - Clientes

---

## 🐳 Infraestructura

### Contenedores

- **[Docker](https://www.docker.com/)** - Plataforma de contenedores
  - Usado para PostgreSQL
  - Configuración en `docker-compose.yml`

- **[Docker Compose](https://docs.docker.com/compose/)** - Herramienta para definir y ejecutar aplicaciones Docker multi-contenedor
  - Servicio `db`: PostgreSQL
  - Servicio `adminer`: Interfaz web para gestión de BD

### Servicios Docker

```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: example
  
  adminer:
    image: adminer
    ports:
      - 8080:8080
```

---

## 🔨 Herramientas de Desarrollo

### Linting y Calidad de Código

- **[ESLint](https://eslint.org/)** (v9.33.0) - Linter de JavaScript/TypeScript
  - `@eslint/js` (v9.33.0) - Configuración base de ESLint
  - `eslint-plugin-react-hooks` (v5.2.0) - Reglas para React Hooks
  - `eslint-plugin-react-refresh` (v0.4.20) - Reglas para React Refresh
  - `typescript-eslint` (v8.39.1) - Parser y plugin de TypeScript
  - `globals` (v16.3.0) - Variables globales

### Compilador

- **[TypeScript Compiler](https://www.typescriptlang.org/)** - Compilador de TypeScript a JavaScript
  - Configuración en `tsconfig.json`
  - Type checking estricto habilitado

### Control de Versiones

- **[Git](https://git-scm.com/)** - Sistema de control de versiones
  - `.gitignore` configurado para excluir:
    - `node_modules`
    - `.env` (variables de entorno)
    - Archivos de build
    - Archivos de IDE

### Package Managers

- **[Bun](https://bun.sh/)** - Package manager principal
  - Archivos de lock: `bun.lock`
  - Instalación y ejecución de dependencias

- **[npm](https://www.npmjs.com/)** - Package manager alternativo
  - Compatible con el proyecto
  - `package-lock.json` presente

### IDE y Configuración

- **Visual Studio Code** - Editor recomendado
  - Configuración en `.idea` (también compatible con JetBrains IDEs)

---

## 📦 Dependencias de Desarrollo

### Backend

```json
{
  "@types/bun": "latest",
  "typescript": "^5"
}
```

### Frontend

```json
{
  "@eslint/js": "^9.33.0",
  "@types/react": "^19.1.10",
  "@types/react-dom": "^19.1.7",
  "@vitejs/plugin-react-swc": "^4.0.0",
  "eslint": "^9.33.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.20",
  "globals": "^16.3.0",
  "typescript": "~5.8.3",
  "typescript-eslint": "^8.39.1",
  "vite": "^7.1.2"
}
```

---

## 🚀 Scripts Disponibles

### Backend

```bash
# Iniciar servidor en modo desarrollo (con hot reload)
bun run dev

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev
```

### Frontend

```bash
# Iniciar servidor de desarrollo
bun run dev

# Construir para producción
bun run build

# Ejecutar linter
bun run lint

# Vista previa de build
bun run preview
```

---

## 📊 Características Técnicas Destacadas

### Backend

- ✅ **API RESTful** con Express.js
- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Hashing de contraseñas** con bcrypt
- ✅ **ORM type-safe** con Prisma
- ✅ **Migraciones automáticas** de base de datos
- ✅ **Middleware de CORS** configurado
- ✅ **Cookie parsing** para sesiones
- ✅ **TypeScript** en todo el backend

### Frontend

- ✅ **React 19** con las últimas características
- ✅ **Vite** para desarrollo ultra-rápido
- ✅ **Tailwind CSS + DaisyUI** para estilos
- ✅ **Routing** con React Router v7
- ✅ **Estado global** con Zustand
- ✅ **Formularios** con React Hook Form
- ✅ **HTTP Client** con Axios
- ✅ **TypeScript** en todo el frontend
- ✅ **ESLint** para calidad de código
- ✅ **Hot Module Replacement (HMR)** con React Refresh

### Base de Datos

- ✅ **PostgreSQL** como sistema principal
- ✅ **Prisma** como ORM type-safe
- ✅ **Migraciones versionadas** con Prisma Migrate
- ✅ **Relaciones complejas** bien definidas
- ✅ **Índices y restricciones** optimizadas

---

## 🌟 Ventajas del Stack Elegido

### Performance

- **Bun** es significativamente más rápido que Node.js
- **Vite** ofrece hot reload instantáneo
- **React 19** con optimizaciones modernas
- **Prisma** genera queries optimizadas

### Developer Experience

- **TypeScript** en todo el stack para type safety
- **Hot reload** en backend y frontend
- **Prisma Studio** para visualización de datos
- **ESLint** para mantener código limpio

### Escalabilidad

- Arquitectura **cliente-servidor separada**
- **API RESTful** fácilmente escalable
- **PostgreSQL** robusto para datos relacionales
- **Docker** para deployment consistente

### Mantenibilidad

- **TypeScript** reduce bugs en producción
- **Prisma** como single source of truth para el schema
- **ESLint** mantiene código consistente
- **Git** para control de versiones

---

## 📚 Recursos y Documentación

- [Documentación de Bun](https://bun.sh/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vite.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)

---

## ✨ Conclusión

Este proyecto utiliza un stack tecnológico moderno y eficiente, combinando las mejores herramientas disponibles para desarrollo web full-stack. La elección de **Bun**, **Prisma**, **TypeScript** y **PostgreSQL** en el backend, junto con **React**, **Vite** y **Tailwind CSS** en el frontend, proporciona una base sólida para construir aplicaciones escalables y mantenibles.

---

**Última actualización:** Noviembre 2025
