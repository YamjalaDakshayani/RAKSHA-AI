# RAKSHA AI — Your Digital Safety Guardian 🛡️

> **Mission:** Detect threats. Prevent scams. Protect people.  
> **Tagline:** Your Digital Safety Guardian.  
> **Headline:** Think Before You Click.

---

## 1. Project Overview

**RAKSHA AI** is an AI-powered cybersecurity assistant engineered to protect everyday citizens, students, job seekers, and senior citizens against modern digital scams, deceptive links, quishing attacks (malicious QR codes), and social engineering fraud.

### Target Audiences & Problems Solved:
- **College Students:** Identify fake Google/Amazon remote internships demanding "refundable registration fees" via UPI, and fraudulent scholarship schemes demanding OTP verification.
- **Job Seekers:** Screen unsolicited WhatsApp/Telegram employment offers before sending resumes, identity documents, or security deposits.
- **Parents & Senior Citizens:** Detect urgent utility disconnect panics ("Power disconnected tonight at 9:30 PM"), lottery tricks, and remote desktop APK droppers (AnyDesk/QuickSupport scams).
- **Everyday Internet Users:** Safely dissect shortened links, lookalike typosquatting domains (`goog1e-verify.xyz`), and camera-scanned QR codes without risk of infection.

---

## 2. Technology Stack

- **Frontend & App Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components & Client Components), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling & Cyber Design:** [Tailwind CSS](https://tailwindcss.com/) with custom dark navy palette (`#070B14`), electric cyan/blue neon accents, and glassmorphism
- **AI Intelligence:** [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash` / `gemini-1.5-flash`) with strict Zod structured JSON schemas and server-side isolation
- **Authentication & Database:** [Supabase](https://supabase.com/) (PostgreSQL database with Row Level Security RLS policies)
- **QR Code Engine:** `jsQR` for client-side HTML5 canvas image decoding & live camera video stream interception
- **Cryptographic Security:** W3C Web Crypto API (`window.crypto.getRandomValues`) for zero-knowledge client password generation & entropy estimation

---

## 3. Core Features & Capabilities

### 🔍 1. Message Detective (`/scan/message`)
- Dissects SMS, WhatsApp, email, job letters, and scholarship notices.
- Deep Gemini neural analysis evaluating artificial urgency, advance fee fraud, brand impersonation, and unofficial domains.
- Displays a **0–100 forensic risk score**, **risk level (Low, Medium, High, Critical)**, extracted red flag phrases, and explicit interaction rules (*"Do not pay"*, *"Do not click"*).
- Includes one-click test sample loaders for fake internships, scholarship phish, electricity panics, and legitimate notices.

### 🌐 2. Link Scanner (`/scan/link`)
- Heuristic URL analyzer that checks:
  - Protocol security (HTTP vs HTTPS — *never assuming HTTPS equals safe*).
  - Typosquatting and lookalike domain detection (e.g. `goog1e`, `paypa1`, `sbi-online.xyz`).
  - URL shorteners (`bit.ly`, `tinyurl`, `t.co`, etc.) with warnings about destination concealment.
  - Raw IP address hosts (`http://192.168.1.105:8080/sbi`).
  - Punycode / IDN homograph attack characters (`xn--`).
  - High-risk TLD extensions (`.xyz`, `.top`, `.work`, `.click`, `.loan`, `.zip`).
  - Excessive subdomain chaining.
- **Guaranteed Zero Auto-Open:** Submitted links are analyzed in isolation and never opened automatically.

### 📷 3. QR Guard (`/scan/qr`)
- Two scanning modes: Live camera scanner (with animated radar overlay) or QR image file upload.
- Extracts raw URL or payload and passes it to the heuristic threat engine.
- Protects users against *quishing* (QR code phishing).
- Includes one-click test buttons for evaluators without physical QR codes.

### 🔑 4. Password Guardian (`/tools/password`)
- **100% In-Browser Zero-Knowledge:** Passwords are never sent across any network or saved in any database.
- Real-time strength meter checking length, uppercase, lowercase, numbers, special symbols, sequential numbers, and dictionary patterns.
- Calculates Shannon entropy and estimated brute-force crack time.
- Integrated Web Crypto API password generator with custom length and symbol filters.

### 🤖 5. AI Safety Coach (`/coach`)
- Friendly, empathetic conversational cybersecurity mentor powered by Gemini.
- Explains UPI fraud, OTP protection rules, Telegram job traps, and phishing signs in simple, non-technical English.
- Instant preset prompts for emergency scenarios (e.g. *"I already shared an OTP — what do I do?"*).

### 📊 6. Security Dashboard (`/dashboard`)
- Real-time threat telemetry: Total scans, threats neutralized, clean items verified, and average threat index.
- Threat severity distribution chart (Critical, High, Medium, Low/Safe).
- Quick launchpad to all security tools.
- Recent interception activity log.

### 📜 7. Scan History (`/history`)
- Unified audit archive of all previous scans.
- Filter by scan type (Message, Link, QR) and risk level.
- Full inspection modal for each scan.
- Export scan reports to JSON or clear history anytime.

### 📖 8. Security Awareness & About (`/about`)
- Comprehensive scam taxonomy for 2026.
- 5-step emergency incident playbook (*"I clicked a suspicious link — what do I do right now?"*).
- Official Cybercrime Reporting Helpline reference (**1930** and `cybercrime.gov.in`).

---

## 4. Local Installation Guide

### Prerequisites:
- [Node.js](https://nodejs.org/) v18.17 or higher
- npm or pnpm package manager

### Step-by-Step Setup:

1. **Clone or open the repository:**
   ```bash
   cd Nova
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your keys (see instructions below).

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 5. Environment Variables & API Setup

Configure `.env.local` with the following variables:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-1.5-flash

# Supabase PostgreSQL & Auth (Optional for Guest/Demo Mode)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Getting a Free Gemini API Key:
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google Account and click **"Get API key"**.
3. Create an API key and copy it into `GEMINI_API_KEY` in `.env.local`.
*(Note: If no API key is provided, RAKSHA AI automatically falls back to an intelligent local heuristic demonstration mode with clear labeling).*

---

## 6. Supabase Database Schema & RLS Setup

If you wish to enable cloud database storage and authentication, execute the following SQL in your **Supabase SQL Editor**:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Scans Table
create table if not exists public.scans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid null references auth.users(id) on delete cascade,
    scan_type text not null check (scan_type in ('message', 'link', 'qr')),
    submitted_content text not null,
    risk_level text not null check (risk_level in ('Low', 'Medium', 'High', 'Critical')),
    risk_score integer not null check (risk_score >= 0 and risk_score <= 100),
    findings jsonb not null default '{}'::jsonb,
    recommendation text not null,
    created_at timestamptz default now() not null
);

-- 2. Create Performance Indexes
create index if not exists idx_scans_user_created on public.scans (user_id, created_at desc);
create index if not exists idx_scans_type on public.scans (scan_type);
create index if not exists idx_scans_risk_level on public.scans (risk_level);

-- 3. Enable Row Level Security (RLS)
alter table public.scans enable row level security;

-- Policy 1: Authenticated users can view ONLY their own scan records
create policy "Users can view own scans"
    on public.scans for select to authenticated
    using (auth.uid() = user_id);

-- Policy 2: Authenticated users can insert scans tagged with their user_id
create policy "Users can insert own scans"
    on public.scans for insert to authenticated
    with check (auth.uid() = user_id);

-- Policy 3: Authenticated users can delete ONLY their own scan records
create policy "Users can delete own scans"
    on public.scans for delete to authenticated
    using (auth.uid() = user_id);
```

*(Note: When Supabase is not connected, RAKSHA AI operates seamlessly in **Local Demonstration Mode**, storing audit history in client state without any crashes or fake claims).*

---

## 7. Emergency Contacts & Responsible AI Disclaimer

- **National Cybercrime Helpline (India):** Dial **1930** (24x7 toll-free)
- **Official Portal:** [cybercrime.gov.in](https://cybercrime.gov.in)
- **Disclaimer:** RAKSHA AI provides AI-based threat assessments and heuristic inspections. These results are analytical evaluations and do not constitute legal or absolute security guarantees. Always confirm sensitive fee demands, bank notices, or employment offers through verified official channels.
