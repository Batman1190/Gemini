# ChatGPT Clone (Minimal)

A minimal local ChatGPT-like app:
- Node.js + Express backend that proxies to OpenAI
- Simple HTML/CSS/JS frontend

## Prerequisites
- Node.js 18+
- An OpenAI API key

## Setup
1. Create a file named `.env` in the project root with:

```env
OPENAI_API_KEY=sk-your-key
PORT=3000
```

2. Install dependencies:

```bash
npm install
```

3. Run the server:

```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser.

## Notes
- The API endpoint is `POST /api/chat` with body: `{ messages: [{ role, content }], model? }`.
- Default model is `gpt-4o-mini`. You can change it per-request.
- Do not expose your API key in the browser; always call via the server.

## Customize
- System prompt: edit the first message in `public/index.html`.
- Temperature: tweak `temperature` in `server.js`.

## Production
Use `npm start` (ensures `NODE_ENV=production`). Consider a process manager (PM2) and TLS termination in front of the server.
