export const DETAIL_HEADERS = [
  "Here’s my honest take",
  "This is how I see it",
  "Let’s break this down",
];

export const POSITIVE_HEADERS = [
  "What works well",
  "Why this makes sense",
  "Strong points",
];

export const CONCERN_HEADERS = [
  "Things to consider",
  "Potential tradeoffs",
  "Where it may fall short",
];

export const FINAL_OPINION_HIGH = [
  "Overall, this is a strong recommendation for you today.",
  "If you’re deciding now, I’d confidently go with this.",
  "This aligns very well with what you’re looking for.",
];

export const FINAL_OPINION_MEDIUM = [
  "This is a solid option, though it’s worth comparing with others.",
  "A good choice, but not the only one worth considering.",
  "Works well overall, with a few tradeoffs in mind.",
];

export const FINAL_OPINION_LOW = [
  "I wouldn’t prioritise this for today.",
  "This isn’t the strongest option right now.",
  "Better saved for a different context.",
];

export function pickPhrase(
  phrases: string[],
  seed: number
) {
  return phrases[seed % phrases.length];
}