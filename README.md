# ChatGPT Clone (Minimal)

A minimal local ChatGPT-like app:
- Node.js + Express backend that proxies to OpenAI
- Simple HTML/CSS/JS frontend

## Prerequisites
- Node.js 18+
- An OpenAI API key

## Setup (Local)
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

## Deploy to GitHub Pages (static) + Cloudflare Worker (API)
GitHub Pages is static-only, so do NOT put your API key in the browser. Deploy the UI to Pages and a small proxy to Cloudflare Workers that holds your key.

### 1) Deploy the proxy (Cloudflare Workers)
- Install Wrangler: `npm i -g wrangler`
- From the `worker/` directory:
  - Login: `wrangler login`
  - Set the secret: `wrangler secret put OPENAI_API_KEY`
  - Deploy: `wrangler deploy`
- Copy the deployed URL, e.g. `https://chatgpt-clone-proxy.yourname.workers.dev`

### 2) Point the UI to your proxy
- Copy `public/config.example.js` to `public/config.js`
- Set:

```js
window.API_BASE = "https://chatgpt-clone-proxy.yourname.workers.dev";
```

### 3) Publish to GitHub Pages
- Commit and push the repo
- In GitHub repo Settings → Pages, choose the branch and `/public` folder (or `/` if you serve from root). If using root, ensure `public/` contents are at the repo root of the Pages branch.
- After Pages builds, open your site URL and chat.

## Alternative: Vercel Serverless Function (no Cloudflare)
You can keep your frontend on GitHub Pages and host only the API on Vercel.

### 1) Add your API route
The repo already includes `api/chat.js` for Vercel. It reads `OPENAI_API_KEY` and proxies to OpenAI.

### 2) Deploy to Vercel
- Push the repo to GitHub
- Import the repo at Vercel
- In Vercel Project → Settings → Environment Variables add:
  - `OPENAI_API_KEY = your key`
- Deploy; your API endpoint will be `https://<your-vercel-app>.vercel.app/api/chat`

### 3) Point the UI to Vercel
- Copy `public/config.example.js` to `public/config.js`
- Set:

```js
window.API_BASE = "https://<your-vercel-app>.vercel.app";
```

- Publish your static `public/` folder to GitHub Pages (or host the entire site on Vercel).

## Notes
- The UI calls `${API_BASE}/api/chat`.
- Default model is `gpt-4o-mini`. You can change it per-request.
- Never expose your OpenAI key in client-side code.

## Customize
- System prompt: edit the first message in `public/index.html`.
- Temperature: tweak `temperature` in `server.js`, the Worker, or the Vercel function.

## Production
If self-hosting the Node server, use `npm start` and a proper reverse proxy/TLS. For static hosting, prefer the Vercel or Worker approaches above.
