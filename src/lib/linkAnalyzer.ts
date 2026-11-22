import { LinkAnalysis } from "./schemas";

const URL_SHORTENERS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "is.gd",
  "buff.ly",
  "ow.ly",
  "cutt.ly",
  "rebrand.ly",
  "shorturl.at",
  "rb.gy",
  "goo.gl",
  "bl.ink",
  "qr.ae",
  "v.gd",
]);

const SUSPICIOUS_TLDS = new Set([
  "xyz",
  "top",
  "work",
  "click",
  "loan",
  "zip",
  "gq",
  "cf",
  "tk",
  "ml",
  "ga",
  "men",
  "stream",
  "bid",
  "country",
  "download",
  "racing",
  "review",
  "party",
  "trade",
  "date",
  "faith",
  "accountant",
]);

const FAMOUS_BRANDS = [
  { name: "Google", regex: /g[o0][o0]g[l1][e3]|google/i },
  { name: "PayPal", regex: /p[a4]yp[a4][l1]|paypal/i },
  { name: "Amazon", regex: /[a4]m[a4]z[o0]n|amazon/i },
  { name: "State Bank of India (SBI)", regex: /sbi[-_]?bank|onlinesbi|sbi[-_]?kyc/i },
  { name: "HDFC Bank", regex: /hdfc[-_]?bank|hdfc[-_]?net/i },
  { name: "ICICI Bank", regex: /icici[-_]?bank/i },
  { name: "Microsoft", regex: /m[i1]cr[o0]s[o0]ft|microsoft/i },
  { name: "Apple", regex: /[a4]pp[l1][e3]|apple/i },
  { name: "Netflix", regex: /n[e3]tf[l1][i1]x|netflix/i },
  { name: "WhatsApp", regex: /wh[a4]ts[a4]pp|whatsapp/i },
  { name: "Paytm", regex: /p[a4]ytm|paytm/i },
  { name: "PhonePe", regex: /ph[o0]n[e3]p[e3]|phonepe/i },
  { name: "Facebook", regex: /f[a4]c[e3]b[o0][o0]k|facebook/i },
  { name: "Instagram", regex: /[i1]nst[a4]gr[a4]m|instagram/i },
];

export function analyzeUrlHeuristics(rawUrl: string): LinkAnalysis {
  let normalized = rawUrl.trim();
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = "https://" + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return {
      url: rawUrl,
      risk_level: "Critical",
      risk_score: 95,
      domain: "Invalid URL",
      protocol: "none",
      is_https: false,
      is_shortener: false,
      is_ip_address: false,
      is_suspicious_tld: false,
      has_punycode: false,
      has_excessive_subdomains: false,
      typosquatting_detected: false,
      detected_brand: null,
      warnings: ["Malformed or invalid URL structure", "Cannot safely parse hostname"],
      explanation: "This input is not a standard web address. Attackers often use malformed or heavily obfuscated strings to exploit parser vulnerabilities.",
      recommendations: ["Do not paste or attempt to open this address in your browser."],
      safe_to_visit: false,
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.replace(":", "").toLowerCase();
  const isHttps = protocol === "https";

  const warnings: string[] = [];
  const recommendations: string[] = [];
  let riskScore = 0;

  // 1. Protocol check
  if (!isHttps) {
    riskScore += 25;
    warnings.push("Insecure HTTP protocol: Traffic between you and this site is unencrypted and vulnerable to eavesdropping and credential theft.");
    recommendations.push("Never enter passwords, bank information, or personal data on unencrypted HTTP pages.");
  }

  // 2. IP Address check
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith("[");
  if (isIpAddress) {
    riskScore += 45;
    warnings.push(`Raw IP Address Hostname (${hostname}): Legitimate consumer websites use domain names. IP address links are heavily correlated with phishing, malicious command-and-control servers, or unverified hosts.`);
    recommendations.push("Avoid visiting direct IP address links sent via unsolicited messages.");
  }

  // 3. URL Shortener check
  const isShortener = URL_SHORTENERS.has(hostname);
  if (isShortener) {
    riskScore += 30;
    warnings.push(`URL Shortener Detected (${hostname}): Shortened links mask the real destination URL to prevent you from seeing where you will actually land.`);
    recommendations.push("Use a link unshortener or preview service before opening. Never click shortened links in SMS, WhatsApp, or unsolicited emails.");
  }

  // 4. Punycode / IDN Homograph check
  const hasPunycode = hostname.startsWith("xn--") || hostname.includes(".xn--");
  if (hasPunycode) {
    riskScore += 40;
    warnings.push("Punycode (IDN Homograph) detected: The domain uses Cyrillic or special characters designed to visually mimic legitimate letters (e.g. replacing Latin 'a' or 'o' with lookalike Unicode glyphs).");
    recommendations.push("Extreme danger of homograph impersonation. Do not interact with this page.");
  }

  // 5. High-risk TLD check
  const tldParts = hostname.split(".");
  const tld = tldParts[tldParts.length - 1];
  const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
  if (isSuspiciousTld) {
    riskScore += 25;
    warnings.push(`High-Risk Top-Level Domain (TLD .${tld}): This extension is frequently abused by spammers and phishing syndicates due to cheap or free anonymous registrations.`);
  }

  // 6. Excessive Subdomains check (e.g. sbi.com.account-update.badsite.com)
  const hasExcessiveSubdomains = tldParts.length >= 4;
  if (hasExcessiveSubdomains) {
    riskScore += 25;
    warnings.push(`Excessive Subdomain Chaining (${tldParts.length} levels): Attackers often place legitimate brand names in deep subdomains to trick mobile users whose browser address bar cuts off the right side.`);
  }

  // 7. Typosquatting / Brand Impersonation check
  let typosquattingDetected = false;
  let detectedBrand: string | null = null;

  for (const brand of FAMOUS_BRANDS) {
    if (brand.regex.test(hostname)) {
      // Check if it's the actual legitimate domain
      const isOfficial = 
        hostname === `${brand.name.toLowerCase()}.com` ||
        hostname.endsWith(`.${brand.name.toLowerCase()}.com`) ||
        (brand.name.includes("SBI") && (hostname === "onlinesbi.sbi" || hostname.endsWith(".sbi.co.in") || hostname.endsWith(".sbi"))) ||
        (brand.name.includes("HDFC") && (hostname === "hdfcbank.com" || hostname.endsWith(".hdfcbank.com"))) ||
        (brand.name.includes("Google") && (hostname === "google.com" || hostname.endsWith(".google.com") || hostname.endsWith(".google.co.in")));

      if (!isOfficial) {
        typosquattingDetected = true;
        detectedBrand = brand.name;
        riskScore += 45;
        warnings.push(`Potential Brand Impersonation / Typosquatting: Domain name contains references mimicking '${brand.name}', but this does NOT belong to the official verified domain.`);
        recommendations.push(`If you intended to visit ${brand.name}, open a new browser tab and type their official address directly.`);
        break;
      }
    }
  }

  // 8. Port check
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    riskScore += 20;
    warnings.push(`Non-standard Network Port (:${parsed.port}): Standard web browsing uses port 80 or 443. Non-standard ports frequently host rogue services or test phish kits.`);
  }

  // 9. Auth credentials in URL (e.g., http://user:pass@evil.com)
  if (parsed.username || parsed.password) {
    riskScore += 40;
    warnings.push("Embedded Authentication Credentials in URL: Attackers use '@' symbols to deceive users into thinking the preceding text is the domain.");
  }

  // Normalize score
  riskScore = Math.min(100, Math.max(0, riskScore));

  // Determine Risk Level
  let riskLevel: "Low" | "Medium" | "High" | "Critical";
  if (riskScore >= 75) {
    riskLevel = "Critical";
  } else if (riskScore >= 50) {
    riskLevel = "High";
  } else if (riskScore >= 20) {
    riskLevel = "Medium";
  } else {
    riskLevel = "Low";
  }

  // Mandatory Cybersecurity Rule: Never claim a site is safe just because it has HTTPS
  if (riskLevel === "Low") {
    recommendations.push("Although no high-risk heuristic flags were triggered, remember that HTTPS only encrypts communication—it does NOT guarantee the site's intentions or owners are honest.");
    recommendations.push("Always verify website authenticity before submitting personal credentials or payments.");
  } else {
    recommendations.push("Do not click, open, or submit passwords/OTP on this destination.");
    recommendations.push("Report suspicious links to your security team or national cyber helpline (1930 in India).");
  }

  let explanation = "";
  if (riskLevel === "Critical" || riskLevel === "High") {
    explanation = `High cybersecurity threat detected for '${hostname}'. Multiple deceptive flags were found, including ${warnings.slice(0, 2).join(" and ").toLowerCase()}. This exhibits textbook phishing or malware delivery infrastructure.`;
  } else if (riskLevel === "Medium") {
    explanation = `Caution advised for '${hostname}'. While not definitively malicious, it exhibits characteristics like ${warnings[0]?.toLowerCase() || "unusual structure"} that warrant caution.`;
  } else {
    explanation = `The address '${hostname}' passed preliminary heuristic checks. Always remain vigilant and never share OTPs or sensitive banking credentials online.`;
  }

  return {
    url: rawUrl,
    risk_level: riskLevel,
    risk_score: riskScore,
    domain: hostname,
    protocol,
    is_https: isHttps,
    is_shortener: isShortener,
    is_ip_address: isIpAddress,
    is_suspicious_tld: isSuspiciousTld,
    has_punycode: hasPunycode,
    has_excessive_subdomains: hasExcessiveSubdomains,
    typosquatting_detected: typosquattingDetected,
    detected_brand: detectedBrand,
    warnings,
    explanation,
    recommendations,
    safe_to_visit: riskLevel === "Low",
  };
}
