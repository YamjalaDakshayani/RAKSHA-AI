"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  useAccessibility,
  LineSpacing,
  LetterSpacing,
  ThemeMode,
} from "@/lib/accessibilityContext";
import { getAvailableVoices } from "@/lib/speech";
import {
  X,
  Type,
  Sun,
  Moon,
  Laptop,
  Volume2,
  Sparkles,
  RotateCcw,
  Eye,
  Sliders,
} from "lucide-react";

export function AccessibilityPanel() {
  const {
    isPanelOpen,
    setIsPanelOpen,
    fontSize,
    setFontSize,
    isLargeText,
    toggleLargeText,
    dyslexiaFont,
    setDyslexiaFont,
    lineSpacing,
    setLineSpacing,
    letterSpacing,
    setLetterSpacing,
    highContrast,
    setHighContrast,
    theme,
    setTheme,
    reducedMotion,
    setReducedMotion,
    speechRate,
    setSpeechRate,
    preferredVoiceUri,
    setPreferredVoiceUri,
    resetToDefaults,
    announce,
  } = useAccessibility();

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>(
    []
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Load available system voices
  useEffect(() => {
    getAvailableVoices().then((voices) => {
      setAvailableVoices(voices);
    });
  }, []);

  // Keyboard accessibility: ESC key to close, focus management
  useEffect(() => {
    if (!isPanelOpen) return;

    // Focus close button on open
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPanelOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPanelOpen, setIsPanelOpen]);

  if (!isPanelOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-panel-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsPanelOpen(false);
        }
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-md h-full overflow-y-auto bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl flex flex-col focus:outline-none"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <h2
              id="a11y-panel-title"
              className="text-xl font-bold text-zinc-900 dark:text-zinc-100"
            >
              Accessibility Options
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={() => setIsPanelOpen(false)}
            aria-label="Close accessibility options"
            className="min-h-touch min-w-touch p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 flex-1 text-zinc-800 dark:text-zinc-200">
          {/* Quick Toggle: Large Text */}
          <section className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="large-text-toggle"
                  className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2"
                >
                  <Type className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  Large Text Mode
                </label>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Quickly set 150% font size
                </p>
              </div>
              <button
                id="large-text-toggle"
                role="switch"
                aria-checked={isLargeText}
                onClick={() => {
                  toggleLargeText();
                  announce(
                    !isLargeText
                      ? "Large text mode turned on"
                      : "Large text mode turned off"
                  );
                }}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  isLargeText ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <span className="sr-only">Toggle large text mode</span>
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isLargeText ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Font Size Slider */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="font-size-slider"
                className="font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Text Size: {fontSize}%
              </label>
              <span className="text-xs text-zinc-500">100% - 200%</span>
            </div>
            <input
              id="font-size-slider"
              type="range"
              min="100"
              max="200"
              step="5"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              aria-valuemin={100}
              aria-valuemax={200}
              aria-valuenow={fontSize}
              aria-label="Font size percentage"
              className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </section>

          {/* Dyslexia-Friendly Font (Lexend) */}
          <section className="flex items-center justify-between">
            <div>
              <span className="font-semibold block text-zinc-900 dark:text-zinc-100">
                Lexend Dyslexia Font
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Improves reading speed and comprehension
              </span>
            </div>
            <button
              role="switch"
              aria-checked={dyslexiaFont}
              onClick={() => {
                const next = !dyslexiaFont;
                setDyslexiaFont(next);
                announce(
                  next ? "Lexend font activated" : "Default font activated"
                );
              }}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                dyslexiaFont ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <span className="sr-only">Toggle dyslexia-friendly font</span>
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  dyslexiaFont ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </section>

          {/* Line Spacing */}
          <section>
            <label className="font-semibold block mb-2 text-zinc-900 dark:text-zinc-100">
              Line Spacing
            </label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup">
              {(["normal", "relaxed", "loose"] as LineSpacing[]).map((spacing) => (
                <button
                  key={spacing}
                  role="radio"
                  aria-checked={lineSpacing === spacing}
                  onClick={() => {
                    setLineSpacing(spacing);
                    announce(`Line spacing set to ${spacing}`);
                  }}
                  className={`min-h-touch py-2 px-3 rounded-lg border text-sm font-medium capitalize transition focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    lineSpacing === spacing
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {spacing}
                </button>
              ))}
            </div>
          </section>

          {/* Letter Spacing */}
          <section>
            <label className="font-semibold block mb-2 text-zinc-900 dark:text-zinc-100">
              Letter Spacing
            </label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup">
              {(["normal", "wide", "wider"] as LetterSpacing[]).map((spacing) => (
                <button
                  key={spacing}
                  role="radio"
                  aria-checked={letterSpacing === spacing}
                  onClick={() => {
                    setLetterSpacing(spacing);
                    announce(`Letter spacing set to ${spacing}`);
                  }}
                  className={`min-h-touch py-2 px-3 rounded-lg border text-sm font-medium capitalize transition focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    letterSpacing === spacing
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {spacing}
                </button>
              ))}
            </div>
          </section>

          {/* Contrast & Theme */}
          <section className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            {/* High Contrast Mode */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold block text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  High Contrast Mode
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Maximum contrast borders and text (WCAG AAA)
                </span>
              </div>
              <button
                role="switch"
                aria-checked={highContrast}
                onClick={() => {
                  const next = !highContrast;
                  setHighContrast(next);
                  announce(
                    next ? "High contrast mode active" : "High contrast disabled"
                  );
                }}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  highContrast ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <span className="sr-only">Toggle high contrast</span>
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    highContrast ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Theme Mode */}
            <div>
              <label className="font-semibold block mb-2 text-zinc-900 dark:text-zinc-100">
                Color Theme
              </label>
              <div className="grid grid-cols-3 gap-2" role="radiogroup">
                {(
                  [
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                    { id: "system", label: "System", icon: Laptop },
                  ] as { id: ThemeMode; label: string; icon: React.ElementType }[]
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    role="radio"
                    aria-checked={theme === id}
                    onClick={() => {
                      setTheme(id);
                      announce(`Theme set to ${label}`);
                    }}
                    className={`min-h-touch flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      theme === id
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold block text-zinc-900 dark:text-zinc-100">
                  Reduced Motion
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Turn off smooth animations and transitions
                </span>
              </div>
              <button
                role="switch"
                aria-checked={reducedMotion}
                onClick={() => {
                  const next = !reducedMotion;
                  setReducedMotion(next);
                  announce(
                    next ? "Reduced motion enabled" : "Reduced motion disabled"
                  );
                }}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  reducedMotion ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <span className="sr-only">Toggle reduced motion</span>
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    reducedMotion ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Read-Aloud Voice & Speed */}
          <section className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
              <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <span>Read-Aloud Settings</span>
            </div>

            {/* Speech Rate */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="speech-rate-slider"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Speaking Speed: {speechRate.toFixed(2)}x
                </label>
                <span className="text-xs text-zinc-500">0.75x - 1.5x</span>
              </div>
              <input
                id="speech-rate-slider"
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                aria-valuemin={0.75}
                aria-valuemax={1.5}
                aria-valuenow={speechRate}
                aria-label="Read-aloud speed"
                className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Voice Choice */}
            {availableVoices.length > 0 && (
              <div>
                <label
                  htmlFor="voice-select"
                  className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300"
                >
                  Preferred Voice
                </label>
                <select
                  id="voice-select"
                  value={preferredVoiceUri || ""}
                  onChange={(e) => setPreferredVoiceUri(e.target.value)}
                  className="w-full min-h-touch px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                >
                  <option value="">Default System Voice (Auto-detect)</option>
                  {availableVoices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>

          {/* Reset Defaults */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => {
                resetToDefaults();
                announce("Accessibility settings reset to default");
              }}
              className="w-full min-h-touch flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
