# Tablerise Backend

REST API + WebSocket server for the **TableRise** application — a platform for managing tabletop RPG sessions, campaigns, characters, and D&D 5e content.

---

## Table of Contents

-   [Overview](#overview)
-   [Tech Stack](#tech-stack)
-   [Architecture](#architecture)
-   [Project Structure](#project-structure)
-   [Prerequisites](#prerequisites)
-   [Environment Variables](#environment-variables)
-   [Running Locally](#running-locally)
-   [Running with Docker](#running-with-docker)
-   [Scripts](#scripts)
-   [Testing](#testing)
-   [API Reference](#api-reference)
    -   [Users](#users)
    -   [OAuth](#oauth)
    -   [Campaigns](#campaigns)
    -   [Characters](#characters)
    -   [D&D 5e System](#dd-5e-system)
-   [WebSocket Events](#websocket-events)
-   [Authentication](#authentication)
-   [Image Storage](#image-storage)

---

## Overview

Tablerise Backend provides the full server-side logic for the TableRise platform. It covers:

-   User registration, authentication (local + OAuth via Google and Discord), and account management
-   Campaign creation and lifecycle management, including match sessions with real-time map and avatar control via WebSockets
-   Character sheet creation with automatic D&D 5e rule enrichment
-   Read-only access to the D&D 5e system catalogue (armors, weapons, spells, monsters, etc.)
-   Two-factor authentication (TOTP + QR code) and secret question security
-   Email verification flows with a finite-state machine
-   Scheduled jobs (e.g., automatic deletion of pending-delete user accounts)
-   Auto-generated Swagger documentation

---

## Tech Stack

| Layer            | Technology                                                 |
| ---------------- | ---------------------------------------------------------- |
| Runtime          | Node.js 20                                                 |
| Language         | TypeScript 5                                               |
| Framework        | Express 4                                                  |
| Database         | MongoDB 5 (via `@tablerise/database-management`)           |
| Cache / Sessions | Redis 7                                                    |
| DI Container     | Awilix 9                                                   |
| Authentication   | Passport.js (local, cookie, Google OAuth2, Discord OAuth2) |
| Real-time        | Socket.IO 4                                                |
| Validation       | Zod 4                                                      |
| Email            | Nodemailer                                                 |
| Image storage    | ImgBB API                                                  |
| 2FA              | Speakeasy + QRCode                                         |
| Job scheduling   | node-cron                                                  |
| API docs         | `@tablerise/auto-swagger` + Swagger UI                     |
| Testing          | Mocha + Chai + Sinon + Supertest                           |
| Linting          | ESLint + Prettier                                          |

---

## Architecture

The project follows a **layered + Domain-Driven Design** style with full dependency injection via Awilix.

```
server.ts
└── container.ts          (Awilix DI setup)
    └── Application.ts    (Express app bootstrap)
        ├── interface/    (HTTP layer: routes, controllers, middlewares, schemas)
        ├── core/         (Use-case operations and domain services)
        ├── domains/      (Business rules, helpers, validators, state machine)
        └── infra/        (Repositories, external clients, data fakers, templates)
```

**Request lifecycle:**

```
HTTP request
  → Passport middleware (auth)
  → Schema validation (Zod)
  → Controller
    → Operation (use-case)
      → Service(s) (domain logic)
        → Repository (MongoDB via database-management)
```

All dependencies are registered as classes/values in [src/container.ts](src/container.ts) and injected via constructor proxy.

---

## Project Structure

```
src/
├── container.ts                  # DI container setup
├── server.ts                     # Entry point
├── core/                         # Use-case operations + services
│   ├── campaigns/
│   ├── characters/
│   ├── dungeons&dragons5e/
│   └── users/
├── domains/                      # Business rules and helpers
│   ├── campaigns/
│   ├── characters/
│   ├── common/                   # Shared helpers, StateMachine, SchemaValidator
│   ├── dungeons&dragons5e/
│   └── users/
├── infra/                        # Infrastructure
│   ├── clients/                  # ImageStorageClient, SocketIO
│   ├── datafakers/               # Seed/mock data generators
│   ├── repositories/             # MongoDB repository wrappers
│   └── templates/                # Email HTML templates
├── interface/                    # Express layer
│   ├── campaigns/
│   ├── characters/
│   ├── common/                   # Shared middlewares and strategies
│   ├── dungeons&dragons5e/
│   └── users/
└── types/                        # TypeScript type declarations and contracts
tests/
├── unit/                         # Unit tests (ts-mocha + sinon)
├── integration/                  # Integration tests (supertest)
└── support/                      # Test helpers and setup
```

---

## Prerequisites

-   **Node.js** >= 20
-   **npm** >= 9
-   **MongoDB** 5 (or Docker)
-   **Redis** 7 (or Docker)

---

## Environment Variables

Create a `.env` file at the project root. The required variables are:

```env
# Server
NODE_ENV=develop
PORT=8080
CORS_ORIGIN=http://localhost:3000
SWAGGER_URL=http://localhost:8080/
COOKIE_SECRET=your_cookie_secret

# MongoDB
MONGODB_USERNAME=root
MONGODB_PASSWORD=secret
MONGODB_HOST=localhost
MONGODB_DATABASE=tablerise
MONGODB_CONNECTION_INITIAL=mongodb

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# OAuth — Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth — Discord
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Email (Nodemailer)
EMAIL_SENDING_USER=
EMAIL_SENDING_PASSWORD=
EMAIL_SENDING=smtp.example.com

# Image storage (ImgBB)
IMGBB_CLIENT_SECRET=
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Build and start with nodemon (watch mode)
npm run local

# Or build once and start
npm run build
npm start
```

The server will be available at `http://localhost:8080` (or the port defined in `PORT`).  
Swagger UI is served at `http://localhost:8080/api-docs`.

---

## Running with Docker

The `docker-compose.yml` spins up MongoDB and Redis:

```bash
# Start infrastructure services
docker compose up -d

# Then run the API locally
npm run local
```

To run the full stack in Docker, build the image and run it alongside the compose services:

```bash
docker build -t tablerise-backend .
docker run --env-file .env -p 8080:8080 tablerise-backend
```

---

## Scripts

| Script                     | Description                                       |
| -------------------------- | ------------------------------------------------- |
| `npm start`                | Run the compiled build                            |
| `npm run build`            | Compile TypeScript to `build/`                    |
| `npm run local`            | Build + start with nodemon (development)          |
| `npm test`                 | Run unit + integration tests                      |
| `npm run test:unit`        | Unit tests only                                   |
| `npm run test:integration` | Integration tests only                            |
| `npm run test:coverage`    | Unit tests with nyc coverage report               |
| `npm run lint`             | ESLint check                                      |
| `npm run prettier`         | Prettier check                                    |
| `npm run prettier:fix`     | Auto-fix formatting                               |
| `npm run populate`         | Seed the database with D&D 5e data                |
| `npm run circular`         | Detect circular dependencies                      |
| `npm run check-lib`        | Check for unauthorized characters in dependencies |
| `npm run check-cov`        | Assert minimum coverage thresholds                |

---

## Testing

Unit tests use **ts-mocha**, **Chai**, and **Sinon** with full DI mocking. Integration tests use **Supertest** against a dedicated MongoDB test instance (port 27018).

```bash
# Unit tests
npm run test:unit

# Integration tests (requires Docker services running)
npm run test:integration

# Coverage report (outputs to coverage/)
npm run test:coverage
```

---

## API Reference

All endpoints except registration, login, and email verification require a valid session cookie set by `/users/login`.

### Users

| Method   | Path                                  | Description                                      |
| -------- | ------------------------------------- | ------------------------------------------------ |
| `GET`    | `/users/all`                          | Get all users (admin only)                       |
| `GET`    | `/users/:id`                          | Get user by ID                                   |
| `GET`    | `/users/logout`                       | Logout current user                              |
| `POST`   | `/users/register`                     | Register a new user                              |
| `POST`   | `/users/login`                        | Login with email and password                    |
| `POST`   | `/users/:id/update/picture`           | Upload profile picture                           |
| `POST`   | `/users/authenticate/email/send-code` | Send email verification code                     |
| `POST`   | `/users/authenticate/email`           | Verify email code (initiates internal auth flow) |
| `POST`   | `/users/authenticate/2fa`             | Verify TOTP 2FA token                            |
| `POST`   | `/users/authenticate/secret-question` | Verify secret question answer                    |
| `PUT`    | `/users/:id/update`                   | Update user profile                              |
| `PATCH`  | `/users/:id/question/activate`        | Activate secret question security                |
| `PATCH`  | `/users/:id/question/update`          | Update secret question                           |
| `PATCH`  | `/users/:id/2fa/activate`             | Activate TOTP 2FA (returns QR code)              |
| `PATCH`  | `/users/:id/2fa/reset`                | Reset TOTP 2FA                                   |
| `PATCH`  | `/users/:id/update/email`             | Update email address                             |
| `PATCH`  | `/users/update/password`              | Update password                                  |
| `PATCH`  | `/users/:id/update/game-info`         | Update game badges/campaigns/characters info     |
| `PATCH`  | `/users/:id/reset`                    | Reset profile to initial state                   |
| `DELETE` | `/users/:id/delete`                   | Delete user account                              |

### OAuth

| Method | Path                  | Description                                                |
| ------ | --------------------- | ---------------------------------------------------------- |
| `GET`  | `/oauth/google`       | Initiate Google OAuth2 flow                                |
| `GET`  | `/oauth/discord`      | Initiate Discord OAuth2 flow                               |
| `PUT`  | `/oauth/:id/complete` | Complete OAuth registration (fill in missing profile data) |

### Campaigns

| Method   | Path                                     | Description                                        |
| -------- | ---------------------------------------- | -------------------------------------------------- |
| `GET`    | `/campaigns`                             | Get all campaigns                                  |
| `GET`    | `/campaigns/:id`                         | Get campaign by ID                                 |
| `GET`    | `/campaigns/user/:id`                    | Get campaigns by user ID                           |
| `POST`   | `/campaigns/create`                      | Create a new campaign (with cover image)           |
| `POST`   | `/campaigns/:id/publishment`             | Publish a campaign match session                   |
| `POST`   | `/campaigns/:id/invite`                  | Invite a player by email                           |
| `POST`   | `/campaigns/:id/ban`                     | Ban a player from the campaign                     |
| `POST`   | `/campaigns/:id/update/player/add`       | Add a player to the campaign                       |
| `POST`   | `/campaigns/:id/update/player/remove`    | Remove a player from the campaign                  |
| `PUT`    | `/campaigns/:id/update`                  | Update campaign details (with cover image)         |
| `PATCH`  | `/campaigns/:id/update/match/map-images` | Upload a map image for the active match            |
| `PATCH`  | `/campaigns/:id/update/match/musics`     | Update background music links for the active match |
| `PATCH`  | `/campaigns/:id/update/images`           | Update campaign gallery images                     |
| `DELETE` | `/campaigns/:id/delete`                  | Delete a campaign                                  |

### Characters

| Method | Path                          | Description                                              |
| ------ | ----------------------------- | -------------------------------------------------------- |
| `GET`  | `/characters`                 | Get all characters (admin only)                          |
| `GET`  | `/characters/:id`             | Get character by ID                                      |
| `GET`  | `/characters/by-campaign/:id` | Get characters linked to a campaign                      |
| `POST` | `/characters/create`          | Create a new character (auto-enriched with D&D 5e rules) |
| `POST` | `/characters/:id/picture`     | Upload character portrait                                |
| `POST` | `/characters/:id/symbol`      | Upload organization symbol image                         |
| `PUT`  | `/characters/:id`             | Update character sheet                                   |

### D&D 5e System

All D&D 5e endpoints follow the pattern `GET /system/dnd5e/{resource}` and support toggling availability via `PATCH /system/dnd5e/{resource}/:id?availability=true|false` (authenticated, admin-level).

| Resource path               | Content                   |
| --------------------------- | ------------------------- |
| `/system/dnd5e/armors`      | Armor catalogue           |
| `/system/dnd5e/weapons`     | Weapon catalogue          |
| `/system/dnd5e/spells`      | Spell catalogue           |
| `/system/dnd5e/classes`     | Character classes         |
| `/system/dnd5e/races`       | Playable races            |
| `/system/dnd5e/backgrounds` | Character backgrounds     |
| `/system/dnd5e/items`       | General items             |
| `/system/dnd5e/magic-items` | Magic items               |
| `/system/dnd5e/feats`       | Feats                     |
| `/system/dnd5e/gods`        | Pantheon / gods           |
| `/system/dnd5e/monsters`    | Monster catalogue         |
| `/system/dnd5e/realms`      | Realm / setting catalogue |
| `/system/dnd5e/wikis`       | Wiki entries              |

---

## WebSocket Events

The server uses **Socket.IO** for real-time campaign match sessions. Connect to the WebSocket server at the same host/port as the REST API.

| Event                | Direction        | Description                                   |
| -------------------- | ---------------- | --------------------------------------------- |
| `join-match`         | Client → Server  | Join a campaign match room                    |
| `add-avatar`         | Client → Server  | Add or create a player avatar on the map      |
| `move-avatar`        | Client → Server  | Move an avatar to new coordinates             |
| `resize-avatar`      | Client → Server  | Resize an avatar on the map                   |
| `delete-avatar`      | Client → Server  | Remove an avatar from the match               |
| `change-map-image`   | Client → Server  | Change the active map background image        |
| `add-avatar-picture` | Client → Server  | Attach a picture to an existing avatar        |
| `disconnect`         | Server → Clients | Broadcast avatar removal on client disconnect |

---

## Authentication

The API uses **cookie-based sessions** via `passport-cookie`. After a successful login or OAuth callback, the server sets a signed cookie that must be sent with every subsequent authenticated request.

**Flows supported:**

-   **Local** — email + password via `POST /users/login`
-   **Google OAuth2** — via `GET /oauth/google`
-   **Discord OAuth2** — via `GET /oauth/discord`

**Second-factor flows** (governed by a finite state machine):

1. Request a verification code: `POST /users/authenticate/email/send-code`
2. Submit the code: `POST /users/authenticate/email`
3. Proceed with either TOTP (`/authenticate/2fa`) or secret question (`/authenticate/secret-question`)

---

## Image Storage

Images (profile pictures, character portraits, campaign covers, map images) are uploaded via **multipart/form-data** and stored externally using the **ImgBB API**. The `IMGBB_CLIENT_SECRET` environment variable must be set for image uploads to work.
