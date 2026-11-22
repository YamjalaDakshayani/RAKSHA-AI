import { describe, it, expect } from "vitest";
import { APP_CONFIG } from "@/config/app";

describe("APP_CONFIG Configuration", () => {
  it("defines single source of truth for name, tagline and mission", () => {
    expect(APP_CONFIG.name).toBe("RAKSHA AI");
    expect(APP_CONFIG.assistantName).toBe("RAKSHA AI");
    expect(APP_CONFIG.tagline).toBe("Your Digital Safety Guardian");
    expect(APP_CONFIG.mission).toBe("Detect threats. Prevent scams. Protect people.");
    expect(APP_CONFIG.headline).toBe("Think Before You Click.");
  });

  it("supports exactly four required languages: en, hi, te, ta", () => {
    const codes = APP_CONFIG.languages.map((l) => l.code);
    expect(codes).toEqual(["en", "hi", "te", "ta"]);
    expect(APP_CONFIG.languages.find((l) => l.code === "te")?.speechCode).toBe("te-IN");
    expect(APP_CONFIG.languages.find((l) => l.code === "hi")?.speechCode).toBe("hi-IN");
    expect(APP_CONFIG.languages.find((l) => l.code === "ta")?.speechCode).toBe("ta-IN");
    expect(APP_CONFIG.languages.find((l) => l.code === "en")?.speechCode).toBe("en-IN");
  });

  it("supports three reading levels", () => {
    const levelIds = APP_CONFIG.readingLevels.map((l) => l.id);
    expect(levelIds).toEqual(["simple", "very_simple", "child_friendly"]);
  });

  it("enforces limits for character count and image size", () => {
    expect(APP_CONFIG.limits.maxTextChars).toBe(8000);
    expect(APP_CONFIG.limits.maxImageBytes).toBe(5 * 1024 * 1024);
    expect(APP_CONFIG.limits.maxImageDimension).toBe(1600);
  });

  it("includes Indian cybercrime helpline 1930 and cybercrime.gov.in", () => {
    expect(APP_CONFIG.trustInfo.cybercrimeHelpline).toBe("1930");
    expect(APP_CONFIG.trustInfo.cybercrimePortal).toBe("cybercrime.gov.in");
    expect(APP_CONFIG.contact.helpline).toBe("1930");
  });

  it("configures realistic test sample scams", () => {
    expect(APP_CONFIG.sampleScams.internship.text).toContain("Rs. 2,999");
    expect(APP_CONFIG.sampleScams.scholarship.text).toContain("Rs. 50,000");
    expect(APP_CONFIG.sampleScams.electricity.text).toContain("disconnected");
    expect(APP_CONFIG.sampleScams.legitimate.text).toContain("examinations");
  });
});
