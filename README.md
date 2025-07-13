# TextAnalyzer

A text analysis tool built with Node.js, TypeScript, Express, and MongoDB. Provides APIs and a web dashboard for analyzing and managing texts, with authentication, rate limiting, and caching.

## Features
- User authentication (local & OAuth2)
- CRUD for texts (create, read, update, delete)
- Text analysis: word, character, sentence, paragraph counts, longest words per paragraph
- Caching for analysis results
- API rate limiting (throttling)
- Protected API endpoints (only for authenticated users)
- Responsive HTML/CSS dashboard
- Test coverage and TDD

## Requirements
- Node.js (v16+ recommended)
- npm
- MongoDB (local or cloud)

## Dependencies
- express
- mongoose
- passport, passport-local, passport-google-oauth20
- express-session
- dotenv
- node-cache
- express-rate-limit
- supertest, jest, ts-jest (for testing)
- typescript, ts-node, nodemon (for dev/build)

## Project Structure
```
TextAnalyzer/
  ├── src/
  │   ├── app.ts                # Express app setup
  │   ├── server.ts             # App entry point
  │   ├── controllers/          # Route controllers
  │   ├── models/               # Mongoose models
  │   ├── routes/               # Express route definitions
  │   ├── services/             # Business logic, analysis, caching
  │   ├── middlewares/          # Custom middleware (rate limiter, etc.)
  │   ├── public/               # Static frontend (HTML, CSS, JS)
  │   └── tests/                # Test suites
  ├── package.json
  ├── tsconfig.json
  └── README.md
```

## Setup
1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd TextAnalyzer
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in required values (MongoDB URI, session secret, OAuth keys, etc.)

## Build
To build the TypeScript project for production:
```sh
npm run build
```
This will compile the TypeScript source files into JavaScript in the `dist/` directory.

## Run the App
- For development (with hot reload):
  ```sh
  npm run dev
  ```
- For production (after building):
  ```sh
  npm start
  ```

## Run Tests & Coverage
```sh
npm test
npm run test:coverage
```

## API Endpoints
- `POST /api/texts` — Create text
- `GET /api/texts` — List texts
- `GET /api/texts/:id` — Get text by ID
- `PUT /api/texts/:id` — Update text
- `DELETE /api/texts/:id` — Delete text
- `POST /api/analyze/word-count` — Word count
- `POST /api/analyze/character-count` — Character count
- `POST /api/analyze/sentence-count` — Sentence count
- `POST /api/analyze/paragraph-count` — Paragraph count
- `POST /api/analyze/longest-words-by-paragraph` — Longest words per paragraph

## Bonus Features
- OAuth2 SSO (Google)
- Rate limiting (per user/IP)
- Caching for analysis