

# 🚀 `Transactions-comercials`

¡Bienvenido al proyecto **Transactions-comercials**\! Este es un sistema completo para la gestión de transacciones, construido con **Bun**, **Prisma**, **TypeScript** y **PostgreSQL**. Sigue esta guía para ponerlo en marcha en tu máquina.

-----

## 🛠️ Requisitos

Antes de empezar, asegúrate de tener instalado lo siguiente:

  * **[Bun](https://bun.sh/)** (v1.1.18 o superior)
  * **[Node.js](https://nodejs.org/)** (aunque usaremos Bun, es útil tenerlo)
  * **[Visual Studio Code](https://code.visualstudio.com/)** (o tu editor de código preferido)
  * **[PostgreSQL](https://www.postgresql.org/)**

-----

## 📂 Puesta en Marcha

Sigue estos sencillos pasos para tener el proyecto funcionando.

### 1\. Clonar el Repositorio

Abre tu terminal y clona el proyecto de GitHub.

```bash
git clone https://github.com/kyxent-Immortal-Dev/Transactions-comercials
```

-----

### 2\. Abrir con VS Code

Abre la carpeta del proyecto en Visual Studio Code.

```bash
cd Transactions-comercials
code .
```

-----

### 3\. Configuración del Backend

Ahora, vamos a configurar el servidor y la base de datos.

#### 📁 Crear el Archivo `.env`

Navega a la carpeta `backend` y crea un archivo llamado `.env` con las siguientes variables:

```bash
cd backend
touch .env
```

Pega el siguiente contenido en el archivo `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:example@localhost:5432/transaciones"
JWT="9u9Oxh054bk0bDJ4q0weqGa7mScV4MskDBdsASbiGpTmGWfB0nJ2RnE8U8FXacIy"
```

#### 📦 Instalar Dependencias

Desde la carpeta `backend`, ejecuta el siguiente comando para instalar todas las dependencias:

```bash
bun install
```

#### 🐘 Configurar Prisma

**Si ya tienes la base de datos hecha y con datos**, solo necesitas generar el cliente de Prisma:

```bash
npx prisma generate
```

**Si necesitas crear la base de datos desde cero**, usa el comando de migración de Prisma. Esto creará la base de datos y las tablas a partir de tu esquema:

```bash
npx prisma migrate dev
```

-----

### 4\. Configuración del Frontend

Navega a la carpeta `frontend` y también instala sus dependencias.

```bash
cd ../frontend
bun install
```

-----

## ▶️ Ejecutar el Proyecto

¡Ya casi terminamos\! Ahora podemos encender el servidor y la interfaz de usuario.

1.  **Ejecuta el Backend**

    En una terminal, asegúrate de estar en la carpeta `backend` y corre el servidor:

    ```bash
    cd ../backend
    bun run dev
    ```

    Verás un mensaje confirmando que el servidor está corriendo.

2.  **Ejecuta el Frontend**

    Abre una **nueva terminal**, navega a la carpeta `frontend` y corre la aplicación web:

    ```bash
    cd ../frontend
    bun run dev
    ```

    El resultado te dará una URL (por ejemplo, `http://localhost:0000`).

-----

## 🎉 ¡Listo para Usar\!

Copia la URL que te dio el frontend (`http://localhost:0000`) y pégala en tu navegador. El proyecto debería estar funcionando correctamente y listo para que interactúes con él.

-----

¡Disfruta del proyecto\! Si tienes alguna pregunta, no dudes en contactarme. 😊
