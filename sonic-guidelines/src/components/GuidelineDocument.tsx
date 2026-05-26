import { useMemo, useState } from 'react';
import type { SonicBrief } from '../lib/types';
import { renderMarkdown } from '../lib/markdown';
import { buildJSON, download, slug } from '../lib/export';

type Status = 'idle' | 'drafting' | 'done' | 'error';

interface Props {
  brief: SonicBrief;
  output: string;
  status: Status;
  error: string;
}

export function GuidelineDocument({ brief, output, status, error }: Props) {
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => (output ? renderMarkdown(output) : ''), [output]);
  const hasDoc = output.trim().length > 0;
  const base = slug(brief.brand);

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="stage">
      <div className="stage-toolbar">
        <div className="stage-status">
          {status === 'drafting' && (
            <span className="status-live">
              <span className="rec-dot" /> Composing the guidelines
            </span>
          )}
          {status === 'done' && <span className="status-done">Draft complete</span>}
          {status === 'idle' && <span className="status-muted">No draft yet</span>}
          {status === 'error' && <span className="status-error">Draft failed</span>}
        </div>
        <div className="stage-tools">
          <button className="btn btn--ghost" disabled={!hasDoc} onClick={copyMarkdown}>
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>
          <button
            className="btn btn--ghost"
            disabled={!hasDoc}
            onClick={() => download(`${base}-sonic-guidelines.md`, output, 'text/markdown')}
          >
            .md
          </button>
          <button
            className="btn btn--ghost"
            disabled={!hasDoc}
            onClick={() =>
              download(`${base}-sonic-guidelines.json`, buildJSON(brief, output), 'application/json')
            }
          >
            .json
          </button>
          <button className="btn btn--ghost" disabled={!hasDoc} onClick={() => window.print()}>
            Print / PDF
          </button>
        </div>
      </div>

      <div className="stage-scroll">
        {!hasDoc && status !== 'error' && (
          <div className="stage-empty">
            <div className="empty-mark" aria-hidden>
              ◴
            </div>
            <h2 className="empty-title">A production-ready sound brief, drafted to direction.</h2>
            <p className="empty-body">
              Fill in the brief and the client direction, then draft. The guidelines cover brand
              sound identity, the sonic logo and mnemonic, the sonic palette, and technical delivery
              &mdash; written for the producers who build the work.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="stage-empty stage-empty--error">
            <h2 className="empty-title">The draft could not be generated.</h2>
            <p className="empty-body">{error}</p>
          </div>
        )}

        {hasDoc && (
          <article className="sheet">
            <div
              className={`doc${status === 'drafting' ? ' doc--streaming' : ''}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
        )}
      </div>
    </section>
  );
}
