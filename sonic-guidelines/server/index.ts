import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, buildUserMessage } from './prompt';
import type { SonicBrief } from '../src/lib/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 8787);
const MODEL = 'claude-opus-4-7';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.post('/api/draft', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error:
        'ANTHROPIC_API_KEY is not set on the server. Add it to your environment and restart.',
    });
    return;
  }

  const brief = req.body as SonicBrief;
  if (!brief || !brief.brand?.trim() || !brief.clientDirection?.trim()) {
    res
      .status(400)
      .json({ error: 'A brand name and the client direction are both required to draft guidelines.' });
    return;
  }

  const client = new Anthropic({ apiKey });
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high' },
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      ],
      messages: [{ role: 'user', content: buildUserMessage(brief) }],
    } as Anthropic.MessageStreamParams);

    stream.on('text', (delta: string) => {
      res.write(delta);
    });

    await stream.finalMessage();
    res.end();
  } catch (err: unknown) {
    const e = err as { error?: { error?: { message?: string } }; message?: string };
    const msg = e?.error?.error?.message || e?.message || 'Failed to draft guidelines.';
    console.error('[draft] error:', msg);
    if (!res.headersSent) {
      res.status(502).json({ error: msg });
    } else {
      res.end();
    }
  }
});

// In production, serve the built frontend from /dist.
if (process.env.NODE_ENV === 'production') {
  const dist = path.resolve(__dirname, '../dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`FCG Sonic Guidelines API listening on http://localhost:${PORT}`);
});
