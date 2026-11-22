import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
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

/**
 * Creates SSR Supabase client reading authenticated user session from cookies
 */
export function createServerSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // May be called from Server Component where setting cookies is restricted
        }
      },
    },
  });
}

/**
 * Helper to fetch the authenticated user session from cookies
 */
export async function getServerSessionUser() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user || null;
  } catch {
    return null;
  }
}

/**
 * Privileged client using SUPABASE_SERVICE_ROLE_KEY if provided
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !url ||
    !serviceKey ||
    url === "https://your-project.supabase.co" ||
    serviceKey === "your-service-role-key-here"
  ) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
