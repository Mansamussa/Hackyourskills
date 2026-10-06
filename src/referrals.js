// Classify only allowlisted sources; never retain full referring URLs or query text.
export function referralSource(referrer, currentOrigin) {
  let host;
  try {
    const parsed=new URL(referrer);
    if (!['https:','http:'].includes(parsed.protocol)) return 'unknown';
    if (parsed.origin===currentOrigin) return 'internal';
    host=parsed.hostname.toLowerCase();
  } catch { return 'direct_or_unknown'; }
  const matches=domain=>host===domain || host.endsWith('.'+domain);
  if (matches('chatgpt.com') || host==='chat.openai.com') return 'chatgpt';
  if (matches('perplexity.ai')) return 'perplexity';
  if (host==='gemini.google.com') return 'gemini';
  if (host==='copilot.microsoft.com') return 'copilot';
  if (matches('claude.ai')) return 'claude';
  if (matches('google.com') || matches('google.nl')) return 'google_search';
  if (matches('bing.com')) return 'bing_search';
  if (matches('duckduckgo.com')) return 'duckduckgo';
  return 'other_referral';
}
