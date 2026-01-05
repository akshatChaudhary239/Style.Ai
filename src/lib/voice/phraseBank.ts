export const TOP_PICK_PHRASES = [
  "This would be my first pick for you today.",
  "If I had to choose one for you right now, I’d go with this.",
  "This fits your intent the best out of the current options.",
];

export const STRONG_ALTERNATIVE_PHRASES = [
  "This is a strong alternative if you want another option.",
  "A good second choice that still aligns well with what you’re going for.",
  "Worth considering if you want a slightly different vibe.",
];

export const SAFE_OPTION_PHRASES = [
  "This is a safe option that should work without much risk.",
  "A balanced choice if you want something reliable.",
  "Not the boldest pick, but dependable.",
];

export const LOW_CONFIDENCE_PHRASES = [
  "I wouldn’t prioritise this for today.",
  "This isn’t the strongest match right now.",
  "Better suited for a different context.",
];

export function pickPhrase(
  phrases: string[],
  seed: number
): string {
  const index = seed % phrases.length;
  return phrases[index];
}

