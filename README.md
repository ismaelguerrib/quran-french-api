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

## 🗃️ Data Model (Database as Source of Truth)

### `verses`

Canonical verses (independent of translations):

- `id`
- `surah_number`
- `ayah_number`
- unique `(surah_number, ayah_number)`

### `translation_sources`

Represents a translation author/source:

- `id`
- `slug` (used by the API as `source`)
- `author_name`
- `language_code` (e.g. `fr`)
- `created_at`

### `verse_texts`

Translated text per verse and per source:

- `id`
- `verse_id`
- `source_id`
- `text`
- unique `(verse_id, source_id)`

---

## 🌐 API Design

- **Protocol**: HTTP
- **Style**: REST
- **Format**: JSON
- **Documentation**: OpenAPI (Swagger)
- **Versioning**: URI-based (`/v1/...`)

### Example

```text
GET /v1/verses/2/255?source=hamidullah-fr,masson-fr
```

```json
{
  "surahNumber": 2,
  "ayahNumber": 255,
  "translations": [
    {
      "source": "hamidullah-fr",
      "author": "Muhammad Hamidullah",
      "text": "..."
    },
    { "source": "masson-fr", "author": "Denise Masson", "text": "..." }
  ]
}
```

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

### Run tests

```bash
npm test
npm run test:e2e
```
