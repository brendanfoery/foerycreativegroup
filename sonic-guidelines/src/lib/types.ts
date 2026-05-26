// Shared between the React client and the Node server (server runs via tsx).
// Keep this file framework-free.

export interface SonicBrief {
  brand: string;
  engagement: string;
  preparedBy: string;
  /** The client's verbatim direction — treated as authoritative by the model. */
  clientDirection: string;
  /** Emotional brief / brand personality. */
  personality: string;
  audience: string;
  /** Selected delivery contexts. */
  touchpoints: string[];
  /** Tonal descriptors. */
  tonalKeywords: string[];
  /** Tempo and energy note, e.g. "Mid-tempo, restrained". */
  tempoEnergy: string;
  /** Reference sounds — likes, dislikes, competitors to avoid. */
  references: string;
  /** Durations, platforms, technical requirements, deadlines. */
  constraints: string;
}

export const EMPTY_BRIEF: SonicBrief = {
  brand: '',
  engagement: '',
  preparedBy: 'Foery Creative Group',
  clientDirection: '',
  personality: '',
  audience: '',
  touchpoints: [],
  tonalKeywords: [],
  tempoEnergy: '',
  references: '',
  constraints: '',
};

export const TOUCHPOINTS: string[] = [
  'Broadcast / TV',
  'Pre-roll & Social Video',
  'Podcast',
  'Streaming / Music DSP',
  'Retail & Environmental',
  'Product UI / App',
  'Phone / IVR',
  'Events & Activations',
  'Web',
];

export const TONAL_KEYWORDS: string[] = [
  'Warm',
  'Cold',
  'Organic',
  'Synthetic',
  'Minimal',
  'Maximal',
  'Classic',
  'Futuristic',
  'Human',
  'Mechanical',
  'Bright',
  'Dark',
  'Premium',
  'Playful',
  'Confident',
  'Intimate',
  'Cinematic',
  'Restrained',
];
