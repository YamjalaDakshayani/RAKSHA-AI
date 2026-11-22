import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { APP_CONFIG } from "@/config/app";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Trash2,
  FileCheck,
  Download,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: `Privacy Policy | ${APP_CONFIG.name}`,
  description:
    "Nova's privacy policy written in plain, human language with no confusing legal jargon.",
};

export default function PrivacyPage() {
  const points = [
    {
      title: "We never save your photos or document images",
      icon: EyeOff,
      description:
        "When you upload or take a photo of a document, it is compressed directly in your browser and sent securely to Google Gemini to read. We NEVER save your photo to our database or file storage. Once the analysis finishes, the image is discarded immediately.",
    },
    {
      title: "Your original text is NOT saved by default",
      icon: Lock,
      description:
        "When you paste or speak text, we only save the AI-generated summary and action steps in your history if you are signed in. Your raw pasted text is only saved if you explicitly turn on the 'Save my original text' switch. By default, it is turned OFF.",
    },
    {
      title: "Voice audio stays on your device",
      icon: FileCheck,
      description:
        "When you use voice input or Talk to Nova, your browser converts your voice into text. We never record, stream, or store your raw voice audio files on our servers.",
    },
    {
      title: "You can download all your data at any time",
      icon: Download,
      description:
        "You own your data. In your Account settings, you can click 'Export my data' to download a clean, readable JSON file containing all your saved analyses and conversation threads.",
    },
    {
      title: "Complete account and history deletion with one click",
      icon: Trash2,
      description:
        "You can delete individual saved documents at any time from your History page, or click 'Delete my account and all data' in Account settings to permanently purge everything from our database immediately.",
    },
    {
      title: "No ad networks, no tracking scripts, no selling data",
      icon: ShieldCheck,
      description:
        "Nova is designed for educational accessibility and inclusion. We do not run third-party advertising trackers, we do not sell your personal data, and we do not profile you.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          <span>Plain-Language Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
          Privacy Policy
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">
          We believe privacy policies should be easy to understand for everyone.
          Here is our promise to you in simple, honest words.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {points.map(({ title, icon: Icon, description }, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-3"
          >
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {title}
              </h2>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>

      {/* AI Processing & Third-party Details */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          How Google Gemini processes your documents
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          To simplify documents and check for scams, text and images are sent to Google Gemini through secure encrypted connections (HTTPS). According to Google&apos;s API policies for enterprise/developer endpoints, data submitted via paid or developer API keys is not used to train Google&apos;s public models.
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          However, as a best practice, you should never upload highly sensitive personal credentials like bank passwords or unredacted government identity cards unless necessary.
        </p>
      </div>

      {/* Guest Mode info */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
            Prefer not to create an account?
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You can use all document analysis and voice features in Guest Mode without signing in.
          </p>
        </div>
        <Link
          href="/"
          className="min-h-touch px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center gap-2"
        >
          <span>Use Nova as Guest</span>
        </Link>
      </div>
    </div>
  );
}
