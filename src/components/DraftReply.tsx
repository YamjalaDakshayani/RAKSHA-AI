"use client";

import React, { useState } from "react";
import { Copy, Check, Mail, MessageSquare } from "lucide-react";
import { ListenButton } from "./ListenButton";
import { SupportedLanguage } from "@/config/app";
import { useAccessibility } from "@/lib/accessibilityContext";

interface DraftReplyProps {
  draftReply: string;
  language: SupportedLanguage;
}

export function DraftReply({ draftReply, language }: DraftReplyProps) {
  const [copied, setCopied] = useState(false);
  const { announce } = useAccessibility();

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(draftReply);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = draftReply;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      announce("Draft reply copied to clipboard");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      announce("Failed to copy automatically. Please select text manually.");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
            Draft My Reply
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <ListenButton
            text={draftReply}
            langCode={language}
            label="Listen to Draft"
            size="sm"
          />

          <button
            type="button"
            onClick={handleCopy}
            className={`min-h-touch px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            aria-label="Copy drafted reply to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>Copy Draft</span>
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        You can copy this polite message and email it directly to your college administration, scholarship desk, or exam controller. Remember to fill in your personal details in brackets.
      </p>

      <div className="bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed select-all">
        {draftReply}
      </div>
    </div>
  );
}
