"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type LineSpacing = "normal" | "relaxed" | "loose";
export type LetterSpacing = "normal" | "wide" | "wider";
export type ThemeMode = "system" | "light" | "dark";

export interface AccessibilitySettings {
  fontSize: number; // 100 to 200%
  isLargeText: boolean; // toggle for quick 150%
  dyslexiaFont: boolean; // Lexend font emphasis
  lineSpacing: LineSpacing;
  letterSpacing: LetterSpacing;
  highContrast: boolean;
  theme: ThemeMode;
  reducedMotion: boolean;
  speechRate: number; // 0.75 to 1.5
  preferredVoiceUri?: string;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 100,
  isLargeText: false,
  dyslexiaFont: true,
  lineSpacing: "relaxed",
  letterSpacing: "normal",
  highContrast: false,
  theme: "system",
  reducedMotion: false,
  speechRate: 1.0,
  preferredVoiceUri: "",
};

interface AccessibilityContextType extends AccessibilitySettings {
  setFontSize: (size: number) => void;
  toggleLargeText: () => void;
  setDyslexiaFont: (val: boolean) => void;
  setLineSpacing: (val: LineSpacing) => void;
  setLetterSpacing: (val: LetterSpacing) => void;
  setHighContrast: (val: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setReducedMotion: (val: boolean) => void;
  setSpeechRate: (rate: number) => void;
  setPreferredVoiceUri: (uri: string) => void;
  resetToDefaults: () => void;
  announcement: string;
  announce: (msg: string) => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

const STORAGE_KEY = "nova_a11y_settings_v1";

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore storage errors in private browsing
    }
    return DEFAULT_SETTINGS;
  });

  const [announcement, setAnnouncement] = useState<string>("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Read system preferences on initial mount
  useEffect(() => {
    try {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;

      setSettings((prev) => {
        let changed = false;
        const next = { ...prev };
        if (prev.theme === "system") {
          // keep theme system, resolved handled dynamically
        }
        if (prev.reducedMotion === false && prefersReduced) {
          next.reducedMotion = true;
          changed = true;
        }
        return changed ? next : prev;
      });
    } catch {
      // media query unsupported
    }
  }, []);

  // Save to localStorage
  const updateSettings = useCallback(
    (updater: (prev: AccessibilitySettings) => AccessibilitySettings) => {
      setSettings((prev) => {
        const next = updater(prev);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // localStorage disabled or full
        }
        return next;
      });
    },
    []
  );

  // Apply DOM classes and styles
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // Font size scaling
    root.style.fontSize = `${settings.fontSize}%`;

    // Theme resolution
    let isDark = false;
    if (settings.theme === "dark") {
      isDark = true;
    } else if (settings.theme === "system") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Line spacing
    root.classList.remove("leading-normal", "leading-relaxed", "leading-loose");
    if (settings.lineSpacing === "loose") {
      root.classList.add("leading-loose");
    } else if (settings.lineSpacing === "relaxed") {
      root.classList.add("leading-relaxed");
    } else {
      root.classList.add("leading-normal");
    }

    // Letter spacing
    root.classList.remove("tracking-normal", "tracking-wide", "tracking-wider");
    if (settings.letterSpacing === "wider") {
      root.classList.add("tracking-wider");
    } else if (settings.letterSpacing === "wide") {
      root.classList.add("tracking-wide");
    } else {
      root.classList.add("tracking-normal");
    }
  }, [settings]);

  const setFontSize = (size: number) => {
    const clamped = Math.max(100, Math.min(200, Math.round(size)));
    updateSettings((prev) => ({
      ...prev,
      fontSize: clamped,
      isLargeText: clamped >= 150,
    }));
  };

  const toggleLargeText = () => {
    updateSettings((prev) => {
      const willBeLarge = !prev.isLargeText;
      return {
        ...prev,
        isLargeText: willBeLarge,
        fontSize: willBeLarge ? 150 : 100,
      };
    });
  };

  const setDyslexiaFont = (val: boolean) => {
    updateSettings((prev) => ({ ...prev, dyslexiaFont: val }));
  };

  const setLineSpacing = (val: LineSpacing) => {
    updateSettings((prev) => ({ ...prev, lineSpacing: val }));
  };

  const setLetterSpacing = (val: LetterSpacing) => {
    updateSettings((prev) => ({ ...prev, letterSpacing: val }));
  };

  const setHighContrast = (val: boolean) => {
    updateSettings((prev) => ({ ...prev, highContrast: val }));
  };

  const setTheme = (theme: ThemeMode) => {
    updateSettings((prev) => ({ ...prev, theme }));
  };

  const setReducedMotion = (val: boolean) => {
    updateSettings((prev) => ({ ...prev, reducedMotion: val }));
  };

  const setSpeechRate = (rate: number) => {
    const clamped = Math.max(0.75, Math.min(1.5, rate));
    updateSettings((prev) => ({ ...prev, speechRate: clamped }));
  };

  const setPreferredVoiceUri = (uri: string) => {
    updateSettings((prev) => ({ ...prev, preferredVoiceUri: uri }));
  };

  const resetToDefaults = () => {
    updateSettings(() => DEFAULT_SETTINGS);
  };

  const announce = useCallback((msg: string) => {
    setAnnouncement(msg);
    // clear slightly later so repeat announcements re-trigger screen readers
    setTimeout(() => {
      setAnnouncement("");
    }, 4000);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setFontSize,
        toggleLargeText,
        setDyslexiaFont,
        setLineSpacing,
        setLetterSpacing,
        setHighContrast,
        setTheme,
        setReducedMotion,
        setSpeechRate,
        setPreferredVoiceUri,
        resetToDefaults,
        announcement,
        announce,
        isPanelOpen,
        setIsPanelOpen,
      }}
    >
      {children}
      {/* Live Region for Screen Readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="a11y-announcement"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
}
