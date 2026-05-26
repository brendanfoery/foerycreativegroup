# FCG Sonic Branding Production Guidelines

An internal Foery Creative Group tool for drafting sonic branding production
guidelines from a client brief. Fill in the brief and the client's direction,
and Claude drafts a complete, production-ready document live on screen —
covering brand sound identity, the sonic logo and mnemonic, the sonic palette,
and technical delivery. Export as Markdown, JSON, or PDF.

---

## What you need first

1. **Node.js** — download the **LTS** version from [nodejs.org](https://nodejs.org)
   and install it. To confirm it worked, open a terminal and run `node --version`
   (you should see a version like `v22.x.x`).
2. **An Anthropic API key** — create one at
   [console.anthropic.com](https://console.anthropic.com) under **API Keys**. It
   starts with `sk-ant-`. Keep it private, like a password.

## Setup

From a terminal, in this folder (`sonic-guidelines/`):

```bash
# 1. Install dependencies (one time)
npm install

# 2. Create your environment file
cp .env.example .env
```

Then open `.env` in any text editor and paste your API key in place of
`sk-ant-...`:

```
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
PORT=8787
```

The key lives only on the server and is never exposed to the browser. The `.env`
file is gitignored, so it will not be committed.

## Running it

```bash
npm run dev
```

This starts the web app and the API server together. Open the printed URL
(**http://localhost:5173**) in your browser.

To stop it, press `Ctrl + C` in the terminal. To start it again later, just run
`npm run dev` from this folder.

## Using the tool

1. **Brand** (required) — the client's brand name.
2. **Client direction** (required) — paste or summarize what the client wants the
   sound to do. This is treated as authoritative; every decision in the document
   answers to it.
3. Fill in the remaining fields as available — personality, audience,
   touchpoints, tonal direction, tempo/energy, references, constraints. The
   sharper the inputs, the sharper the guidelines.
4. Click **Draft guidelines**. The document writes itself in real time.

When the draft completes you can **Copy Markdown**, download **.md** or **.json**,
or **Print / PDF** (save as PDF from your browser's print dialog).

---

## How it's built

- **Frontend:** Vite + React + TypeScript (dev server on port `5173`)
- **Backend:** Node + Express (API on port `8787`), streams the draft from the
  Anthropic API
- **Model:** Claude Opus 4.7 via `@anthropic-ai/sdk`, with the large system
  prompt prompt-cached across drafts
- **Rendering:** streaming Markdown via `marked`, sanitized with `dompurify`

In development, Vite proxies `/api` requests to the Express server (see
`vite.config.ts`).

### Production build

```bash
npm run build   # type-checks and builds the frontend into dist/
npm start       # serves the built app + API on a single port (PORT, default 8787)
```

## Project layout

```
sonic-guidelines/
├── server/
│   ├── index.ts        # Express server: validates the brief, streams the draft
│   └── prompt.ts       # System prompt (the FCG director persona) + brief builder
├── src/
│   ├── App.tsx                       # State + streaming fetch
│   ├── components/
│   │   ├── BriefForm.tsx             # The brief input panel
│   │   └── GuidelineDocument.tsx     # The document view + export toolbar
│   ├── lib/
│   │   ├── types.ts                  # SonicBrief shape, touchpoint/tonal options
│   │   ├── markdown.ts               # Markdown → safe HTML
│   │   └── export.ts                 # .md / .json download helpers
│   └── styles.css
├── .env.example
├── package.json
└── vite.config.ts
```

## Troubleshooting

- **"ANTHROPIC_API_KEY is not set"** — your `.env` file is missing or the key
  line is blank. Confirm `.env` exists in this folder and has a real key.
- **Port already in use** — another copy is still running. Stop it with
  `Ctrl + C`, or change `PORT` in `.env`.
- **Draft fails immediately** — check that your API key is valid and your
  Anthropic account has credit.
