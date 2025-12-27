import { createContext, useContext, useState } from "react";

export type StyleContextState = {
  occasion?: "wedding" | "party" | "office" | "casual";
  styleOverride?: "traditional" | "classic" | "streetwear";
  locationOverride?: string;
  exploration?: boolean;
};

type StyleContextType = {
  context: StyleContextState;
  setContext: (ctx: Partial<StyleContextState>) => void;
  resetContext: () => void;
};

const StyleContext = createContext<StyleContextType | null>(null);

export function StyleContextProvider({ children }: { children: React.ReactNode }) {
  const [context, setContextState] = useState<StyleContextState>({});

  function setContext(ctx: Partial<StyleContextState>) {
    setContextState((prev) => ({ ...prev, ...ctx }));
  }

  function resetContext() {
    setContextState({});
  }

  return (
    <StyleContext.Provider value={{ context, setContext, resetContext }}>
      {children}
    </StyleContext.Provider>
  );
}

export function useStyleContext() {
  const ctx = useContext(StyleContext);
  if (!ctx) throw new Error("useStyleContext must be used inside provider");
  return ctx;
}
