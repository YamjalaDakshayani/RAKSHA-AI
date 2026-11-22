import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, hashIdentifier } from "@/lib/rateLimit";

describe("Rate Limiting Service", () => {
  it("hashes identifiers with SHA-256 and salt", () => {
    const hash1 = hashIdentifier("192.168.1.1");
    const hash2 = hashIdentifier("192.168.1.1");
    const hash3 = hashIdentifier("192.168.1.2");

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1).toHaveLength(64); // SHA-256 hex length
  });

  it("allows initial requests within limit", async () => {
    const testIp = `test-ip-${Date.now()}`;
    const result = await checkRateLimit({ clientIp: testIp });

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThan(0);
    expect(result.limit).toBe(10); // Default guest limit
  });

  it("blocks requests when rate limit threshold is exceeded", async () => {
    const testIp = `exceed-ip-${Date.now()}`;

    // Exhaust 10 guest requests
    for (let i = 0; i < 10; i++) {
      const res = await checkRateLimit({ clientIp: testIp });
      expect(res.allowed).toBe(true);
    }

    // 11th request must be blocked
    const blockedRes = await checkRateLimit({ clientIp: testIp });
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("allocates higher limit (40) for authenticated users", async () => {
    const userId = `user-${Date.now()}`;
    const res = await checkRateLimit({ userId });

    expect(res.allowed).toBe(true);
    expect(res.limit).toBe(40);
  });
});
