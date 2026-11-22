import { describe, it, expect } from "vitest";
import { analyzeUrlHeuristics } from "@/lib/linkAnalyzer";
import { analyzeThreatLocalFallback } from "@/lib/gemini";

describe("RAKSHA AI Threat Detection Engine", () => {
  describe("Link Scanner Heuristics", () => {
    it("detects typosquatting lookalike domains with high risk score", () => {
      const result = analyzeUrlHeuristics("https://goog1e-verify-security.xyz/login");
      expect(result.typosquatting_detected).toBe(true);
      expect(["High", "Critical"]).toContain(result.risk_level);
      expect(result.risk_score).toBeGreaterThanOrEqual(70);
      expect(result.safe_to_visit).toBe(false);
    });

    it("detects obfuscated URL shorteners", () => {
      const result = analyzeUrlHeuristics("http://bit.ly/pm-scholarship-gov-claim");
      expect(result.is_shortener).toBe(true);
      expect(result.is_https).toBe(false);
      expect(result.risk_score).toBeGreaterThanOrEqual(50);
      expect(result.warnings.some((w) => w.includes("Shortener"))).toBe(true);
    });

    it("detects raw IP address hosts", () => {
      const result = analyzeUrlHeuristics("http://192.168.1.105:8080/sbi-online/update-kyc.html");
      expect(result.is_ip_address).toBe(true);
      expect(result.risk_level).toBe("Critical");
      expect(result.safe_to_visit).toBe(false);
    });

    it("evaluates legitimate official domains as Low Risk", () => {
      const result = analyzeUrlHeuristics("https://www.google.com");
      expect(result.risk_level).toBe("Low");
      expect(result.safe_to_visit).toBe(true);
      expect(result.typosquatting_detected).toBe(false);
      // Ensures security rule: Even on Low risk, never claim HTTPS means guaranteed safe
      expect(result.recommendations.some((r) => r.includes("HTTPS only encrypts"))).toBe(true);
    });
  });

  describe("Message Detective Threat Engine", () => {
    it("flags fake Google/Amazon internship demanding Rs. 2,999 advance fee", () => {
      const scamMsg = "Congratulations! Selected for Google Internship. Pay Rs. 2,999 registration fee via UPI within 2 hours to confirm.";
      const analysis = analyzeThreatLocalFallback(scamMsg);
      expect(analysis.risk_level).toBe("Critical");
      expect(analysis.is_likely_scam).toBe(true);
      expect(analysis.should_avoid_payment).toBe(true);
      expect(analysis.should_avoid_interaction).toBe(true);
      expect(analysis.suspicious_indicators.some((i) => i.includes("Advance Fee Fraud"))).toBe(true);
    });

    it("flags electricity disconnection panic with high risk", () => {
      const panicMsg = "Your power will be disconnected tonight at 9:30 PM. Call 9876543210 immediately.";
      const analysis = analyzeThreatLocalFallback(panicMsg);
      expect(analysis.risk_score).toBeGreaterThanOrEqual(30);
      expect(analysis.suspicious_indicators.some((i) => i.includes("Artificial Urgency"))).toBe(true);
    });

    it("evaluates normal messages without scam triggers as Low/Medium", () => {
      const cleanMsg = "Hello team, tomorrow's study group meeting is rescheduled to 4 PM in the library.";
      const analysis = analyzeThreatLocalFallback(cleanMsg);
      expect(analysis.risk_level).toBe("Low");
      expect(analysis.is_likely_scam).toBe(false);
      expect(analysis.should_avoid_payment).toBe(false);
    });
  });
});
