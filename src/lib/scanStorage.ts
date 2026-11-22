import { ScanRecord } from "./schemas";
import { isSupabaseBrowserConfigured, createBrowserSupabaseClient } from "./supabaseBrowser";

const STORAGE_KEY = "raksha_scans_history_v1";

// Default starter demonstration scans for hackathon presentation if history is empty
const INITIAL_DEMO_SCANS: ScanRecord[] = [
  {
    id: "demo-scan-1",
    scan_type: "message",
    submitted_content: "Google India Remote Internship: Pay Rs. 2,999 registration fee via UPI to secure slot. Apply at http://google-careers.live",
    risk_level: "Critical",
    risk_score: 94,
    findings: {
      summary: "High-confidence Advance-Fee recruitment scam impersonating Google.",
      suspicious_indicators: [
        "Legitimate employers never demand registration fees.",
        "Payment requested via personal UPI ID.",
        "Deceptive unverified domain (google-careers.live).",
      ],
      warning_signs: ["Advance fee fraud", "Brand impersonation"],
      explanation: "Scammers prey on college students looking for remote internships by falsely using Google branding to extract advance fees.",
      recommended_actions: ["Block sender", "Never transfer UPI funds", "Report to cybercrime.gov.in"],
    },
    recommendation: "DO NOT PAY. Block sender immediately.",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "demo-scan-2",
    scan_type: "link",
    submitted_content: "https://goog1e-verify-security.xyz/login?account=lock",
    risk_level: "Critical",
    risk_score: 92,
    findings: {
      domain: "goog1e-verify-security.xyz",
      protocol: "https",
      is_https: true,
      is_shortener: false,
      is_ip_address: false,
      is_suspicious_tld: true,
      warnings: [
        "Typosquatting detected: 'goog1e' mimics 'Google' using number 1.",
        "Suspicious TLD .xyz frequently leveraged in phishing campaigns.",
      ],
      explanation: "This link attempts credential harvesting by masquerading as a Google security alert.",
      recommendations: ["Do not enter credentials or click"],
    },
    recommendation: "Phishing Lookalike Domain. Close window.",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: "demo-scan-3",
    scan_type: "qr",
    submitted_content: "http://bit.ly/pm-scholarship-gov-claim",
    risk_level: "High",
    risk_score: 82,
    findings: {
      domain: "bit.ly",
      protocol: "http",
      is_https: false,
      is_shortener: true,
      is_ip_address: false,
      is_suspicious_tld: false,
      warnings: [
        "Unencrypted HTTP protocol.",
        "URL Shortener disguises true target address.",
      ],
      explanation: "QR Code destination conceals an unencrypted link claiming to disburse scholarship funds.",
      recommendations: ["Do not open destination in browser", "Delete QR image"],
    },
    recommendation: "Suspicious Quishing link. Do not visit.",
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

export async function loadScans(): Promise<{ scans: ScanRecord[]; isSupabase: boolean }> {
  if (typeof window === "undefined") {
    return { scans: INITIAL_DEMO_SCANS, isSupabase: false };
  }

  // Check if Supabase client is connected and user is logged in
  if (isSupabaseBrowserConfigured()) {
    try {
      const supabase = createBrowserSupabaseClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("scans")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (!error && data) {
            return { scans: data as ScanRecord[], isSupabase: true };
          }
        }
      }
    } catch (err) {
      console.warn("Supabase load error, falling back to local storage:", err);
    }
  }

  // Local storage fallback
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_SCANS));
      return { scans: INITIAL_DEMO_SCANS, isSupabase: false };
    }
    const parsed = JSON.parse(raw);
    return { scans: Array.isArray(parsed) ? parsed : INITIAL_DEMO_SCANS, isSupabase: false };
  } catch {
    return { scans: INITIAL_DEMO_SCANS, isSupabase: false };
  }
}

export async function storeScan(record: Omit<ScanRecord, "id" | "created_at">): Promise<ScanRecord> {
  const newScan: ScanRecord = {
    ...record,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "scan-" + Date.now(),
    created_at: new Date().toISOString(),
  };

  if (typeof window === "undefined") return newScan;

  // Attempt Supabase insert if logged in
  if (isSupabaseBrowserConfigured()) {
    try {
      const supabase = createBrowserSupabaseClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("scans")
            .insert({
              ...record,
              user_id: user.id,
              submitted_content: (record.submitted_content || "").slice(0, 500),
            })
            .select()
            .single();

          if (!error && data) {
            return data as ScanRecord;
          }
        }
      }
    } catch (err) {
      console.warn("Could not write to Supabase, saving locally:", err);
    }
  }

  // Always update local storage as well for quick UI responsiveness
  try {
    const { scans } = await loadScans();
    const updated = [newScan, ...scans.filter((s) => s.id !== newScan.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Local storage write failed:", err);
  }

  return newScan;
}

export async function removeScan(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (isSupabaseBrowserConfigured()) {
    try {
      const supabase = createBrowserSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from("scans").delete().eq("id", id);
        if (!error) {
          // also delete from local
        }
      }
    } catch {}
  }

  try {
    const { scans } = await loadScans();
    const updated = scans.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export async function clearAllLocalScans(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}
