"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import {
  ShieldAlert,
  Search,
  QrCode,
  KeyRound,
  BotMessageSquare,
  LayoutDashboard,
  History,
  Info,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { isSupabaseBrowserConfigured, createBrowserSupabaseClient } from "@/lib/supabaseBrowser";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false);

  useEffect(() => {
    const configured = isSupabaseBrowserConfigured();
    setIsSupabaseAvailable(configured);

    if (configured) {
      try {
        const supabase = createBrowserSupabaseClient();
        if (supabase) {
          supabase.auth.getUser().then(({ data }) => {
            setUser(data?.user || null);
          });

          const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              setUser(session?.user || null);
            }
          );

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        }
      } catch (err) {
        console.warn("Supabase auth check error:", err);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createBrowserSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
        setUser(null);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinks = [
    { href: "/scan/message", label: "Message Detective", icon: Search },
    { href: "/scan/link", label: "Link Scanner", icon: ShieldAlert },
    { href: "/scan/qr", label: "QR Guard", icon: QrCode },
    { href: "/tools/password", label: "Password Guardian", icon: KeyRound },
    { href: "/coach", label: "AI Safety Coach", icon: BotMessageSquare },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/history", label: "History", icon: History },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-[#070B14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo size="md" withTagline={true} />

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    : "text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth / Demo Mode Status Button */}
        <div className="hidden lg:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-md truncate max-w-[140px]">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-md bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/10 hover:border-cyan-400 transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Demo</span>
              </Link>
              <Link
                href="/scan/message"
                className="btn-cyber-primary px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan Now</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger button */}
        <div className="flex xl:hidden items-center gap-2">
          <Link
            href="/scan/message"
            className="btn-cyber-primary px-2.5 py-1 rounded text-xs font-bold sm:hidden"
          >
            Scan
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070B14]/98 border-b border-cyan-500/20 px-4 pt-3 pb-6 space-y-1 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-cyan-300"
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-slate-400 truncate max-w-[200px]">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-400 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold text-cyan-400 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/10"
                >
                  Sign In / Demo Mode
                </Link>
                <Link
                  href="/scan/message"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold btn-cyber-primary rounded-lg"
                >
                  Security Scan
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
