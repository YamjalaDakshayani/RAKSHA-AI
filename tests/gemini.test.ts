import { describe, it, expect } from "vitest";
import { GeminiError } from "@/lib/gemini";

describe("Gemini AI Integration Logic", () => {
  it("formats GeminiError with user-friendly message and status codes", () => {
    const error = new GeminiError(
      "RESOURCE_EXHAUSTED: 429 Too Many Requests",
      "Nova is very busy right now. Please try again in a moment.",
      429,
      true
    );

    expect(error.statusCode).toBe(429);
    expect(error.isQuotaError).toBe(true);
    expect(error.userFriendlyMessage).toBe(
      "Nova is very busy right now. Please try again in a moment."
    );
  });

  it("handles safety filters with friendly non-technical message", () => {
    const safetyError = new GeminiError(
      "Safety block triggered",
      "This document could not be analyzed because it triggered safety filters. Please review the text and try again.",
      400
    );

    expect(safetyError.statusCode).toBe(400);
    expect(safetyError.userFriendlyMessage).toContain("safety filters");
  });
});
