import { describe, it, expect } from "vitest";
import { findBestVoice, NovaSpeechSynthesizer } from "@/lib/speech";

describe("Speech Synthesis Utilities", () => {
  const mockVoices: SpeechSynthesisVoice[] = [
    {
      voiceURI: "Google English India",
      name: "Google English India",
      lang: "en-IN",
      localService: true,
      default: true,
    },
    {
      voiceURI: "Google Hindi",
      name: "Google हिन्दी",
      lang: "hi-IN",
      localService: true,
      default: false,
    },
    {
      voiceURI: "Google Tamil",
      name: "Google தமிழ்",
      lang: "ta-IN",
      localService: true,
      default: false,
    },
  ];

  it("finds matching voice for Hindi", () => {
    const voice = findBestVoice(mockVoices, "hi");
    expect(voice).toBeDefined();
    expect(voice?.lang).toBe("hi-IN");
  });

  it("finds matching voice for Tamil", () => {
    const voice = findBestVoice(mockVoices, "ta");
    expect(voice).toBeDefined();
    expect(voice?.lang).toBe("ta-IN");
  });

  it("returns null when no matching voice exists for Telugu", () => {
    // mockVoices does not have Telugu
    const voice = findBestVoice(mockVoices, "te");
    expect(voice).toBeNull();
  });

  it("returns explicit friendly message when device lacks voice for a language", () => {
    // Mock window.speechSynthesis
    const originalSpeechSynthesis = window.speechSynthesis;
    (window as any).speechSynthesis = {
      getVoices: () => mockVoices,
      speak: () => {},
      cancel: () => {},
      pause: () => {},
      resume: () => {},
    };

    const result = NovaSpeechSynthesizer.speak({
      text: "నమస్కారం",
      langCode: "te",
    });

    expect(result.hasVoice).toBe(false);
    expect(result.errorMsg).toBe(
      "Your device has no Telugu voice installed. Showing text only."
    );

    // Restore
    (window as any).speechSynthesis = originalSpeechSynthesis;
  });
});
