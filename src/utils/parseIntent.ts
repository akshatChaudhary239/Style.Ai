import { StyleContextState } from "@/context/StyleContext";

export function parseIntent(text: string): Partial<StyleContextState> {
  const t = text.toLowerCase();

  if (t.includes("wedding")) return { occasion: "wedding" };
  if (t.includes("party")) return { occasion: "party" };
  if (t.includes("office")) return { occasion: "office" };
  if (t.includes("casual")) return { occasion: "casual" };

  if (t.includes("traditional")) return { styleOverride: "traditional" };
  if (t.includes("classic") || t.includes("old money")) return { styleOverride: "classic" };
  if (t.includes("street")) return { styleOverride: "streetwear" };

  if (t.includes("near me") || t.includes("nearby")) return { exploration: true };

  return {};
}
