import type { SonicBrief } from './types';

export function slug(s: string): string {
  return (
    (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'sonic-branding'
  );
}

export function download(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function buildJSON(brief: SonicBrief, doc: string): string {
  return JSON.stringify(
    {
      tool: 'FCG Sonic Branding Production Guidelines',
      generatedAt: new Date().toISOString(),
      brand: brief.brand,
      engagement: brief.engagement,
      preparedBy: brief.preparedBy,
      brief,
      document: doc,
    },
    null,
    2,
  );
}
