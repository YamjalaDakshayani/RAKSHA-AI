-- ========================================================================
-- RAKSHA AI DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Designed for PostgreSQL & Supabase
-- ========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ========================================================================
-- 1. SCANS TABLE
-- Stores threat scans performed by users (Message Detective, Link Scanner, QR Guard).
-- Note: Passwords from Password Guardian are NEVER transmitted or stored here!
-- ========================================================================
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

-- ========================================================================
-- 2. INDEXES FOR HIGH-SPEED QUERYING
-- ========================================================================
create index if not exists idx_scans_user_created 
    on public.scans (user_id, created_at desc);

create index if not exists idx_scans_type 
    on public.scans (scan_type);

create index if not exists idx_scans_risk_level
    on public.scans (risk_level);

-- ========================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures each authenticated user can ONLY read, insert, and delete their own scans.
-- ========================================================================
alter table public.scans enable row level security;

-- Policy 1: Authenticated users can view ONLY their own scan records
drop policy if exists "Users can view own scans" on public.scans;
create policy "Users can view own scans"
    on public.scans
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy 2: Authenticated users can insert scans tagged with their user_id
drop policy if exists "Users can insert own scans" on public.scans;
create policy "Users can insert own scans"
    on public.scans
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy 3: Authenticated users can delete ONLY their own scan records
drop policy if exists "Users can delete own scans" on public.scans;
create policy "Users can delete own scans"
    for delete
    to authenticated
    using (auth.uid() = user_id);
