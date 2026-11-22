import { createBrowserClient } from "@supabase/ssr";

export function isSupabaseBrowserConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
      anonKey &&
      url.trim() !== "" &&
      anonKey.trim() !== "" &&
      url !== "https://your-project.supabase.co" &&
      anonKey !== "your-anon-key-here"
  );
}

export function createBrowserSupabaseClient() {
  if (!isSupabaseBrowserConfigured()) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(url, anonKey);
}
