import { createContext, useContext, useState } from "react";

/**
 * Represents temporary styling intent selected by the user.
 * Draft = being edited
 * Applied = actively used by recommender
 */
export type StyleContextState = {
  occasion?: "wedding" | "party" | "office" | "casual";
  styleOverride?: "traditional" | "classic" | "streetwear";
  locationOverride?: string;
  exploration?: boolean;
};

type StyleContextType = {
  draftContext: StyleContextState;
  appliedContext: StyleContextState;
  setDraftContext: (ctx: Partial<StyleContextState>) => void;
  applyContext: () => void;
  resetContext: () => void;
};

const StyleContext = createContext<StyleContextType | null>(null);

export function StyleContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [draftContext, setDraftContextState] =
    useState<StyleContextState>({});

  const [appliedContext, setAppliedContext] =
    useState<StyleContextState>({});

  /**
   * Update draft context only (used by Stylist Chat / UI controls)
   */
  function setDraftContext(ctx: Partial<StyleContextState>) {
    setDraftContextState((prev) => ({
      ...prev,
      ...ctx,
    }));
  }

  /**
   * Apply current draft context to recommender
   */
  function applyContext() {
    setAppliedContext(draftContext);
  }

  /**
   * Reset everything (useful for "clear context")
   */
  function resetContext() {
    setDraftContextState({});
    setAppliedContext({});
  }

  return (
    <StyleContext.Provider
      value={{
        draftContext,
        appliedContext,
        setDraftContext,
        applyContext,
        resetContext,
      }}
    >
      {children}
    </StyleContext.Provider>
  );
}

export function useStyleContext() {
  const ctx = useContext(StyleContext);
  if (!ctx) {
    throw new Error(
      "useStyleContext must be used inside StyleContextProvider"
    );
  }
  return ctx;
}
