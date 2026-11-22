import { describe, it, expect } from "vitest";
import nextConfig from "../next.config.mjs";

describe("Security Architecture & HTTP Headers", () => {
  it("defines comprehensive security headers in next.config.mjs", async () => {
    expect(nextConfig.headers).toBeDefined();
    if (typeof nextConfig.headers === "function") {
      const headerConfigs = await nextConfig.headers();
      expect(headerConfigs.length).toBeGreaterThan(0);

      const rootHeaders = headerConfigs[0].headers;
      const headerMap = new Map(rootHeaders.map((h: { key: string; value: string }) => [h.key, h.value]));

      // 1. X-Content-Type-Options
      expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");

      // 2. X-Frame-Options
      expect(headerMap.get("X-Frame-Options")).toBe("DENY");

      // 3. Referrer-Policy
      expect(headerMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");

      // 4. Permissions-Policy: microphone self only
      const permissionsPolicy = headerMap.get("Permissions-Policy");
      expect(permissionsPolicy).toBeDefined();
      expect(permissionsPolicy).toContain("microphone=(self)");

      // 5. Content-Security-Policy
      const csp = headerMap.get("Content-Security-Policy");
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("https://*.supabase.co");
      expect(csp).toContain("https://generativelanguage.googleapis.com");
      expect(csp).toContain("https://accounts.google.com");
      expect(csp).toContain("object-src 'none'");
    }
  });

  it("ensures poweredByHeader is disabled to prevent server fingerprinting", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
