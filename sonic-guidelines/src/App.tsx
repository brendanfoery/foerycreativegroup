import { useCallback, useRef, useState } from 'react';
import { EMPTY_BRIEF, type SonicBrief } from './lib/types';
import { BriefForm } from './components/BriefForm';
import { GuidelineDocument } from './components/GuidelineDocument';

type Status = 'idle' | 'drafting' | 'done' | 'error';

export default function App() {
  const [brief, setBrief] = useState<SonicBrief>(EMPTY_BRIEF);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const canDraft = brief.brand.trim().length > 0 && brief.clientDirection.trim().length > 0;

  const draft = useCallback(async () => {
    if (!canDraft || status === 'drafting') return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('drafting');
    setError('');
    setOutput('');

    try {
      const res = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(data.error || 'The request failed.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setOutput(acc);
      }
      setStatus('done');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError((err as Error).message || 'Something went wrong.');
      setStatus('error');
    }
  }, [brief, canDraft, status]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setOutput('');
    setStatus('idle');
    setError('');
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="wordmark">
          <span className="monogram">FCG</span>
          <span className="wordmark-text">
            <span className="wordmark-name">Foery Creative Group</span>
            <span className="wordmark-sub">Sonic Branding · Production Guidelines</span>
          </span>
        </div>
        <div className="topbar-meta">
          <span className="meta-pill">Claude Opus 4.7</span>
          <span className="meta-pill meta-pill--muted">Internal</span>
        </div>
      </header>

      <main className="main">
        <BriefForm
          brief={brief}
          onChange={setBrief}
          onDraft={draft}
          onReset={reset}
          canDraft={canDraft}
          status={status}
        />
        <GuidelineDocument
          brief={brief}
          output={output}
          status={status}
          error={error}
        />
      </main>
    </div>
  );
}
