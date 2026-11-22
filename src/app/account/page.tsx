"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Download,
  Trash2,
  LogOut,
  Mail,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { APP_CONFIG } from "@/config/app";
import { createBrowserSupabaseClient } from "@/lib/supabaseBrowser";
import { useAccessibility } from "@/lib/accessibilityContext";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string; created_at?: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { announce } = useAccessibility();

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email,
            created_at: authUser.created_at,
          });
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    const supabase = createBrowserSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    announce("Signed out successfully.");
    router.push("/");
    router.refresh();
  };

  const handleExportData = async () => {
    setIsExporting(true);
    announce("Preparing your data download...");
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nova_data_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      announce("Data download started.");
    } catch {
      announce("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    announce("Deleting account and all data...");
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      announce("Your account and all saved data have been permanently deleted.");
      setShowDeleteModal(false);
      router.push("/");
      router.refresh();
    } catch {
      announce("Could not complete deletion. Please try again.");
      setIsDeleting(false);
    }
  };

  if (!isLoading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
          <User className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Guest Mode Active
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            You are using Nova as a guest. To save your circulars and manage your account, please sign in with an email magic link.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/login"
            className="min-h-touch px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Sign In with Magic Link
          </Link>
          <Link
            href="/"
            className="min-h-touch px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 rounded-xl text-sm font-semibold transition"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              Account & Data Control
            </h1>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Manage your authenticated session, download your data, or permanently delete your account.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="min-h-touch px-4 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center gap-2 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Info Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>Authenticated Account Details</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700/80">
            <span className="text-xs text-zinc-500 block">Signed in as</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 break-all">
              {user?.email || "Authenticated User"}
            </span>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700/80">
            <span className="text-xs text-zinc-500 block">Member since</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "Active"}
            </span>
          </div>
        </div>
      </div>

      {/* Data Sovereignty Card: Export & Delete */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          Your Data, Your Ownership
        </h2>

        {/* Export Data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <span>Export My Data</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
              Download all your saved document simplifications, quiz scores, and voice conversations as a single JSON file.
            </p>
          </div>

          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="min-h-touch px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center gap-2 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{isExporting ? "Exporting..." : "Download JSON"}</span>
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Delete Account & All Data</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
              Permanently purges your user profile, saved circulars, and chat history. This action cannot be undone.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="min-h-touch px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-rose-600 flex items-center gap-2 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>Delete My Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-full bg-rose-100 dark:bg-rose-950/80">
                <AlertTriangle className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 id="delete-dialog-title" className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                Permanently Delete Account?
              </h2>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              This will immediately and permanently erase all your saved analyses, circular summaries, chat threads, and your authentication record. There is no way to recover this data.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="min-h-touch px-4 py-2 text-sm font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="min-h-touch px-4 py-2 text-sm font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-rose-600 flex items-center gap-2"
              >
                <span>{isDeleting ? "Deleting..." : "Yes, Delete Everything"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
