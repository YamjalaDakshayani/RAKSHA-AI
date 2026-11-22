"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ListOrdered,
  Calendar,
  FileCheck2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  BookOpen,
  Volume2,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { AnalyzeResult } from "@/lib/schemas";
import { SupportedLanguage, ReadingLevel, APP_CONFIG } from "@/config/app";
import { ListenButton } from "./ListenButton";
import { Quiz } from "./Quiz";
import { DraftReply } from "./DraftReply";
import { FollowUpBox } from "./FollowUpBox";
import { FeedbackBox } from "./FeedbackBox";

interface ResultCardsProps {
  result: AnalyzeResult;
  language: SupportedLanguage;
  level: ReadingLevel;
  analysisId?: string;
}

export function ResultCards({
  result,
  language,
  level,
  analysisId,
}: ResultCardsProps) {
  const [activeTab, setActiveTab] = useState<"cards" | "draft" | "followup">("cards");

  // Construct full text script for "Listen to everything"
  const fullDocumentAudioText = `
Document Title: ${result.title}.
What this is: ${result.summary}.
What you must do: ${result.steps.join(". ")}.
Deadline: ${result.deadline}.
Documents needed: ${result.documents_needed.join(", ")}.
If ignored: ${result.risks_if_ignored}.
Safety verdict: This document ${
    result.trust_check.verdict === "genuine"
      ? "looks genuine"
      : result.trust_check.verdict === "careful"
      ? "requires caution"
      : "looks like a likely scam"
  }. ${result.trust_check.reason}. Safety tip: ${result.trust_check.tip}.
  `.trim();

  // Document context string passed to follow-up questions
  const documentContext = `
Title: ${result.title}
Summary: ${result.summary}
Steps: ${result.steps.join("; ")}
Deadline: ${result.deadline}
Documents: ${result.documents_needed.join("; ")}
Risks if ignored: ${result.risks_if_ignored}
Trust verdict: ${result.trust_check.verdict} (${result.trust_check.reason})
  `.trim();

  // Trust Verdict Visual Details
  const verdictConfig = {
    genuine: {
      label: "Looks Genuine",
      subLabel: "Official college/department circular format",
      icon: ShieldCheck,
      badgeClass:
        "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800",
      cardBorder: "border-emerald-200 dark:border-emerald-900/60",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    careful: {
      label: "Be Careful",
      subLabel: "Requires verification with your college administration",
      icon: ShieldAlert,
      badgeClass:
        "bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800",
      cardBorder: "border-amber-200 dark:border-amber-900/60",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    scam: {
      label: "Likely Scam / Fraud",
      subLabel: "Urgent threats or personal UPI demands detected",
      icon: ShieldX,
      badgeClass:
        "bg-rose-100 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800",
      cardBorder: "border-rose-300 dark:border-rose-900",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
  }[result.trust_check.verdict];

  const VerdictIcon = verdictConfig.icon;

  return (
    <div className="space-y-8 animate-fadeIn" aria-label="Analysis Results">
      {/* Header bar with Title, Listen to Everything, and Tab navigation */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <span>Verified Explanation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {result.title}
            </h2>
          </div>

          {/* Action buttons: Listen to everything & Talk to Nova */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/talk"
              className="min-h-touch px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center gap-2 shadow-sm"
              title="Discuss this notice hands-free in Talk to Nova"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>Talk with Nova</span>
            </Link>

            <ListenButton
              text={fullDocumentAudioText}
              langCode={language}
              label="Listen to Everything"
              size="lg"
              className="w-full sm:w-auto shadow-sm"
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Result Sections"
          className="flex border-b border-zinc-200 dark:border-zinc-800 space-x-4 pt-2"
        >
          <button
            role="tab"
            aria-selected={activeTab === "cards"}
            aria-controls="panel-cards"
            id="tab-cards"
            onClick={() => setActiveTab("cards")}
            className={`min-h-touch pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              activeTab === "cards"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>Document Breakdown</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "draft"}
            aria-controls="panel-draft"
            id="tab-draft"
            onClick={() => setActiveTab("draft")}
            className={`min-h-touch pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              activeTab === "draft"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <span>Draft My Reply</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "followup"}
            aria-controls="panel-followup"
            id="tab-followup"
            onClick={() => setActiveTab("followup")}
            className={`min-h-touch pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
              activeTab === "followup"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <span>Ask Follow-up</span>
          </button>
        </div>
      </div>

      {/* TAB PANEL 1: Cards Breakdown */}
      {activeTab === "cards" && (
        <div id="panel-cards" role="tabpanel" aria-labelledby="tab-cards" className="space-y-6">
          {/* Trust Check Banner Card */}
          <div
            className={`bg-white dark:bg-zinc-900 rounded-2xl border-2 p-5 sm:p-6 shadow-sm ${verdictConfig.cardBorder}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${verdictConfig.badgeClass}`}>
                  <VerdictIcon className="w-7 h-7" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-zinc-500">
                      Trust & Scam Check
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${verdictConfig.badgeClass}`}
                    >
                      {verdictConfig.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-0.5">
                    {verdictConfig.subLabel}
                  </p>
                </div>
              </div>

              <ListenButton
                text={`Safety check verdict: ${verdictConfig.label}. ${result.trust_check.reason}. Important tip: ${result.trust_check.tip}`}
                langCode={language}
                label="Listen"
                size="sm"
              />
            </div>

            <div className="pt-4 space-y-3">
              <div>
                <h4 className="text-xs uppercase font-bold text-zinc-500 tracking-wider">
                  Reason for verdict
                </h4>
                <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-1 leading-relaxed">
                  {result.trust_check.reason}
                </p>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700/80">
                <h4 className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                  Safety Tip for Students & Parents
                </h4>
                <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-0.5 leading-relaxed">
                  {result.trust_check.tip}
                </p>
                <div className="mt-2 text-xs text-zinc-500 flex flex-wrap items-center gap-2">
                  <span>National Cyber Fraud Helpline: <strong>{APP_CONFIG.trustInfo.cybercrimeHelpline}</strong></span>
                  <span>•</span>
                  <a
                    href={`https://${APP_CONFIG.trustInfo.cybercrimePortal}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline inline-flex items-center gap-1 font-semibold hover:text-indigo-600"
                  >
                    <span>{APP_CONFIG.trustInfo.cybercrimePortal}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. What this is (Summary) */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                      What This Is
                    </h3>
                  </div>
                  <ListenButton
                    text={result.summary}
                    langCode={language}
                    label="Listen"
                    size="sm"
                  />
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* 2. Deadline Card (Highlighted) */}
            <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/60 dark:from-zinc-900 dark:to-zinc-800/80 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                      Deadline
                    </h3>
                  </div>
                  <ListenButton
                    text={`Deadline: ${result.deadline}`}
                    langCode={language}
                    label="Listen"
                    size="sm"
                  />
                </div>
                <div className="p-3 bg-white/90 dark:bg-zinc-900/90 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <p className="text-base sm:text-lg font-extrabold text-indigo-900 dark:text-indigo-200">
                    {result.deadline}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. What you must do (Numbered Steps) */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm md:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    What You Must Do (Step-by-Step)
                  </h3>
                </div>
                <ListenButton
                  text={`What you must do: ${result.steps.join(". ")}`}
                  langCode={language}
                  label="Listen"
                  size="sm"
                />
              </div>

              <ol className="space-y-3">
                {result.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step.replace(/^\d+\.\s*/, "")}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* 4. Documents or Things You Need */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Documents You Need
                  </h3>
                </div>
                <ListenButton
                  text={`Documents needed: ${result.documents_needed.join(", ")}`}
                  langCode={language}
                  label="Listen"
                  size="sm"
                />
              </div>

              {result.documents_needed.length > 0 ? (
                <ul className="space-y-2">
                  {result.documents_needed.map((doc, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-zinc-800 dark:text-zinc-200"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" aria-hidden="true" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">No specific documents mentioned.</p>
              )}
            </div>

            {/* 5. What Happens If You Ignore It */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    What Happens If You Ignore It
                  </h3>
                </div>
                <ListenButton
                  text={`If ignored: ${result.risks_if_ignored}`}
                  langCode={language}
                  label="Listen"
                  size="sm"
                />
              </div>

              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                {result.risks_if_ignored}
              </div>
            </div>

            {/* 6. Key Words Explained (Glossary) */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm md:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Key Words Explained Simply
                  </h3>
                </div>
                <ListenButton
                  text={`Key words explained: ${result.glossary
                    .map((g) => `${g.term}: ${g.meaning}`)
                    .join(". ")}`}
                  langCode={language}
                  label="Listen"
                  size="sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.glossary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-1"
                  >
                    <h4 className="font-bold text-sm text-indigo-700 dark:text-indigo-300">
                      {item.term}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Confusion Check Quiz */}
            <div className="md:col-span-2">
              <Quiz quizItems={result.quiz} />
            </div>
          </div>
        </div>
      )}

      {/* TAB PANEL 2: Draft My Reply */}
      {activeTab === "draft" && (
        <div id="panel-draft" role="tabpanel" aria-labelledby="tab-draft">
          <DraftReply draftReply={result.draft_reply} language={language} />
        </div>
      )}

      {/* TAB PANEL 3: Ask Follow-up */}
      {activeTab === "followup" && (
        <div id="panel-followup" role="tabpanel" aria-labelledby="tab-followup">
          <FollowUpBox
            documentContext={documentContext}
            language={language}
            level={level}
          />
        </div>
      )}

      {/* Feedback Widget at bottom */}
      <FeedbackBox analysisId={analysisId} />
    </div>
  );
}
