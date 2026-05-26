import { type SonicBrief, TOUCHPOINTS, TONAL_KEYWORDS } from '../lib/types';

type Status = 'idle' | 'drafting' | 'done' | 'error';

interface Props {
  brief: SonicBrief;
  onChange: (brief: SonicBrief) => void;
  onDraft: () => void;
  onReset: () => void;
  canDraft: boolean;
  status: Status;
}

export function BriefForm({ brief, onChange, onDraft, onReset, canDraft, status }: Props) {
  const set = <K extends keyof SonicBrief>(key: K, value: SonicBrief[K]) =>
    onChange({ ...brief, [key]: value });

  const toggle = (key: 'touchpoints' | 'tonalKeywords', value: string) => {
    const list = brief[key];
    set(key, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const drafting = status === 'drafting';

  return (
    <aside className="brief">
      <div className="brief-scroll">
        <div className="brief-head">
          <h1 className="brief-title">The Brief</h1>
          <p className="brief-lede">
            Capture the client&rsquo;s direction. The draft is built from it &mdash; the sharper the
            inputs, the sharper the guidelines.
          </p>
        </div>

        <section className="field-group">
          <div className="field-row">
            <label className="field">
              <span className="field-label">Brand <em>required</em></span>
              <input
                className="input"
                value={brief.brand}
                onChange={(e) => set('brand', e.target.value)}
                placeholder="e.g. Meridian Bank"
                spellCheck
              />
            </label>
            <label className="field">
              <span className="field-label">Engagement</span>
              <input
                className="input"
                value={brief.engagement}
                onChange={(e) => set('engagement', e.target.value)}
                placeholder="e.g. 2026 Brand Refresh"
              />
            </label>
          </div>

          <label className="field">
            <span className="field-label">Prepared by</span>
            <input
              className="input"
              value={brief.preparedBy}
              onChange={(e) => set('preparedBy', e.target.value)}
            />
          </label>
        </section>

        <section className="field-group">
          <label className="field">
            <span className="field-label">
              Client direction <em>required</em>
            </span>
            <textarea
              className="input textarea textarea--tall"
              value={brief.clientDirection}
              onChange={(e) => set('clientDirection', e.target.value)}
              placeholder="Paste or summarize the client's direction verbatim. This is treated as authoritative — every decision in the guidelines answers to it."
              rows={5}
            />
          </label>
        </section>

        <section className="field-group">
          <span className="group-heading">Identity</span>
          <label className="field">
            <span className="field-label">Brand personality / emotional brief</span>
            <textarea
              className="input textarea"
              value={brief.personality}
              onChange={(e) => set('personality', e.target.value)}
              placeholder="The feeling the brand should evoke; its character in human terms."
              rows={3}
            />
          </label>
          <label className="field">
            <span className="field-label">Target audience</span>
            <input
              className="input"
              value={brief.audience}
              onChange={(e) => set('audience', e.target.value)}
              placeholder="Who is listening, and where"
            />
          </label>
        </section>

        <section className="field-group">
          <span className="group-heading">Touchpoints</span>
          <p className="group-note">Where the sound lives. Drives the technical delivery spec.</p>
          <div className="chips">
            {TOUCHPOINTS.map((t) => (
              <button
                type="button"
                key={t}
                className={`chip${brief.touchpoints.includes(t) ? ' chip--on' : ''}`}
                onClick={() => toggle('touchpoints', t)}
                aria-pressed={brief.touchpoints.includes(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section className="field-group">
          <span className="group-heading">Tonal direction</span>
          <div className="chips">
            {TONAL_KEYWORDS.map((t) => (
              <button
                type="button"
                key={t}
                className={`chip chip--tonal${brief.tonalKeywords.includes(t) ? ' chip--on' : ''}`}
                onClick={() => toggle('tonalKeywords', t)}
                aria-pressed={brief.tonalKeywords.includes(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <label className="field">
            <span className="field-label">Tempo / energy</span>
            <input
              className="input"
              value={brief.tempoEnergy}
              onChange={(e) => set('tempoEnergy', e.target.value)}
              placeholder="e.g. Mid-tempo, restrained, never frantic"
            />
          </label>
        </section>

        <section className="field-group">
          <span className="group-heading">Context</span>
          <label className="field">
            <span className="field-label">Reference sounds &mdash; likes, dislikes, avoid</span>
            <textarea
              className="input textarea"
              value={brief.references}
              onChange={(e) => set('references', e.target.value)}
              placeholder="Tracks or brands they admire; sounds to steer away from; competitors not to echo."
              rows={3}
            />
          </label>
          <label className="field">
            <span className="field-label">Constraints</span>
            <textarea
              className="input textarea"
              value={brief.constraints}
              onChange={(e) => set('constraints', e.target.value)}
              placeholder="Required durations, platforms, technical requirements, deadlines."
              rows={3}
            />
          </label>
        </section>
      </div>

      <div className="brief-actions">
        <button className="btn btn--primary" onClick={onDraft} disabled={!canDraft || drafting}>
          {drafting ? (
            <>
              <span className="rec-dot" /> Drafting&hellip;
            </>
          ) : status === 'done' || status === 'error' ? (
            'Redraft guidelines'
          ) : (
            'Draft guidelines'
          )}
        </button>
        {(status === 'done' || status === 'error') && !drafting && (
          <button className="btn btn--ghost" onClick={onReset}>
            Clear
          </button>
        )}
      </div>
    </aside>
  );
}
