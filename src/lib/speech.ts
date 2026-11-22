// Speech Synthesis & Recognition utilities with robust fallback handling

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isDefault: boolean;
}

export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Wait for voiceschanged event
    const handleVoicesChanged = () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
      resolve(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

    // Timeout fallback if event never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
      resolve(window.speechSynthesis.getVoices());
    }, 1000);
  });
}

/**
 * Find the best matching voice for a language code (e.g. "te", "hi", "ta", "en")
 */
export function findBestVoice(
  voices: SpeechSynthesisVoice[],
  langCode: string,
  preferredVoiceUri?: string
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  if (preferredVoiceUri) {
    const match = voices.find((v) => v.voiceURI === preferredVoiceUri);
    if (match) return match;
  }

  // Exact speech prefix match (e.g., te-IN, hi-IN, ta-IN, en-IN)
  const langPrefix = langCode.toLowerCase().split("-")[0];

  // Try exact locale match first
  const exactMatch = voices.find((v) =>
    v.lang.toLowerCase().startsWith(`${langPrefix}-in`)
  );
  if (exactMatch) return exactMatch;

  // Try general language prefix
  const generalMatch = voices.find((v) =>
    v.lang.toLowerCase().startsWith(langPrefix)
  );
  if (generalMatch) return generalMatch;

  return null;
}

export class NovaSpeechSynthesizer {
  private static activeUtterance: SpeechSynthesisUtterance | null = null;
  private static activeCloudAudio: HTMLAudioElement | null = null;
  private static cloudObjectUrl: string | null = null;

  static stop(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.activeUtterance = null;
    }
    if (this.activeCloudAudio) {
      this.activeCloudAudio.pause();
      this.activeCloudAudio.currentTime = 0;
      this.activeCloudAudio = null;
    }
    if (this.cloudObjectUrl) {
      URL.revokeObjectURL(this.cloudObjectUrl);
      this.cloudObjectUrl = null;
    }
  }

  static pause(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
    this.activeCloudAudio?.pause();
  }

  static resume(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }
    void this.activeCloudAudio?.play();
  }

  static async speakWithFallback(params: {
    text: string;
    langCode: string;
    rate?: number;
    preferredVoiceUri?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: string) => void;
  }): Promise<{ hasVoice: boolean; errorMsg?: string }> {
    const localResult = this.speak(params);
    if (localResult.hasVoice) return localResult;

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: params.text,
          language: params.langCode,
          rate: params.rate ?? 1,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Cloud speech generation failed.");
      }
      if (!data.audioBase64 || !data.mimeType) {
        throw new Error("The speech service returned no audio.");
      }

      const bytes = Uint8Array.from(atob(data.audioBase64), (char) => char.charCodeAt(0));
      const blob = new Blob([bytes], { type: data.mimeType });
      this.cloudObjectUrl = URL.createObjectURL(blob);
      const audio = new Audio(this.cloudObjectUrl);
      this.activeCloudAudio = audio;
      audio.onplaying = () => params.onStart?.();
      audio.onended = () => {
        if (this.activeCloudAudio === audio) this.activeCloudAudio = null;
        if (this.cloudObjectUrl) {
          URL.revokeObjectURL(this.cloudObjectUrl);
          this.cloudObjectUrl = null;
        }
        params.onEnd?.();
      };
      audio.onerror = () => {
        params.onError?.("Generated speech could not be played.");
      };
      await audio.play();
      return { hasVoice: true };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Cloud speech generation failed. Please try again.";
      params.onError?.(message);
      return { hasVoice: false, errorMsg: message };
    }
  }

  static speak(params: {
    text: string;
    langCode: string;
    rate?: number;
    preferredVoiceUri?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: string) => void;
  }): { hasVoice: boolean; errorMsg?: string } {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return {
        hasVoice: false,
        errorMsg: "Speech is not supported on this browser.",
      };
    }

    // Cancel any ongoing speech
    this.stop();

    const voices = window.speechSynthesis.getVoices();
    const voice = findBestVoice(voices, params.langCode, params.preferredVoiceUri);

    // When no matching voice is available, use the cloud fallback.
    if (!voice) {
      const langNames: Record<string, string> = {
        en: "English",
        te: "Telugu",
        hi: "Hindi",
        ta: "Tamil",
      };
      const name = langNames[params.langCode] || params.langCode;
      return {
        hasVoice: false,
        errorMsg: `Your device has no ${name} voice installed. Showing text only.`,
      };
    }

    const utterance = new SpeechSynthesisUtterance(params.text);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = params.langCode === "hi" ? "hi-IN" : params.langCode === "te" ? "te-IN" : params.langCode === "ta" ? "ta-IN" : "en-IN";
    }

    utterance.rate = params.rate ?? 1.0;

    utterance.onstart = () => {
      params.onStart?.();
    };

    utterance.onend = () => {
      this.activeUtterance = null;
      params.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.activeUtterance = null;
      params.onError?.(e.error || "Speech playback error");
    };

    this.activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);

    return { hasVoice: true };
  }
}
