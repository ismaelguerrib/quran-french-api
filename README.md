# 📖 Quran French API

This project provides a **read-only API** built with **NestJS**, exposed as a **HTTP REST API** returning **JSON**, and documented via **OpenAPI (Swagger)**.

The API serves Quran verses and **multiple French translations per verse**.

---

## ✨ Core Principles

- 🌐 **HTTP REST API**
- 📦 **JSON** as the data exchange format
- 🧱 **NestJS** as the backend framework
- 📖 **OpenAPI (Swagger)** for API documentation and discoverability
- 🔒 **Read-only API** (no mutation endpoints)
- 🗃️ **Database as the single source of truth**

## 🌐 API Design

- **Protocol**: HTTP
- **Style**: REST
- **Format**: JSON
- **Documentation**: OpenAPI (Swagger)
- **Versioning**: URI-based (`/v1/...`)

---

## 🧠 Key Design Decisions

- The API is **publicly consumable** via standard HTTP REST
- JSON is used to maximize interoperability
- OpenAPI (Swagger) is the **contract and documentation layer**
- The database is the **only runtime dependency**
- Translations are filtered and selected using the `source` parameter

---

## 🧪 Development & Testing Strategy

- Database schema and migrations come first
- Data is seeded from Excel before API development
- API tests rely exclusively on the database
- Import logic is tested independently

## 📜 License

The source code of this project is licensed under the **Apache License 2.0**.

Please note that the Quran translations used to populate the database are subject to their own respective licenses and copyrights. This project does not claim ownership over the translation texts.

---

## 🚀 First Steps Configured

The project now includes a first working API foundation aligned with the design above:

- URI versioning through `/v1`
- Read-only endpoints:
  - `GET /v1/health`
  - `GET /v1/verses/:surahNumber/:ayahNumber?source=...`
- Initial OpenAPI document endpoint:
  - `GET /v1/openapi.json`

### Run locally

```bash
npm install
npm run start:dev
```

### Run with local PostgreSQL (Docker)

1. Create your local env file:

```bash
cp .env.example .env
```

2. Start PostgreSQL:

```bash
docker compose up -d postgres
```

3. Verify the container is healthy:

```bash
docker compose ps
```

4. Start the API:

```bash
npm run start:dev
```

5. Stop PostgreSQL when done:

```bash
docker compose down
```

Default local credentials are defined in `.env.example`:

- host: `127.0.0.1`
- port: `5432`
- database: `quran_french_api`
- username: `quran_api`
- password: `quran_api`

### Run tests

```bash
npm test
npm run test:e2e
```
