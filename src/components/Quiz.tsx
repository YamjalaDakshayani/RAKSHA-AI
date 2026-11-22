"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, RotateCcw } from "lucide-react";
import { AnalyzeResult } from "@/lib/schemas";
import { useAccessibility } from "@/lib/accessibilityContext";

interface QuizProps {
  quizItems: AnalyzeResult["quiz"];
}

export function Quiz({ quizItems }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const { announce } = useAccessibility();

  if (!quizItems || quizItems.length === 0) return null;

  const handleSelect = (qIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optionIdx,
    }));

    const isCorrect = optionIdx === quizItems[qIdx].answer_index;
    if (isCorrect) {
      announce(`Question ${qIdx + 1}: Correct! Well done.`);
    } else {
      announce(
        `Question ${qIdx + 1}: Not quite. Here is a simpler explanation: ${quizItems[qIdx].simpler_explanation}`
      );
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    announce("Quiz reset. You can try the questions again.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Quick Confusion Check
          </h3>
        </div>
        {Object.keys(selectedAnswers).length > 0 && (
          <button
            onClick={handleReset}
            className="min-h-touch px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        )}
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Test your understanding of the essential requirements. There are no grades—if an answer is wrong, Nova will explain it with an easier analogy!
      </p>

      <div className="space-y-6">
        {quizItems.map((item, qIdx) => {
          const selected = selectedAnswers[qIdx];
          const hasAnswered = selected !== undefined;
          const isCorrect = selected === item.answer_index;

          return (
            <fieldset
              key={qIdx}
              className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-3"
            >
              <legend className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 mb-2">
                {qIdx + 1}. {item.question}
              </legend>

              <div className="space-y-2">
                {item.options.map((opt, optIdx) => {
                  const isThisSelected = selected === optIdx;
                  const isThisCorrectOption = optIdx === item.answer_index;

                  let optionStyle =
                    "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200";

                  if (hasAnswered) {
                    if (isThisCorrectOption) {
                      optionStyle =
                        "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold";
                    } else if (isThisSelected && !isCorrect) {
                      optionStyle =
                        "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-100 line-through";
                    } else {
                      optionStyle = "opacity-60 border-zinc-200 dark:border-zinc-800";
                    }
                  } else if (isThisSelected) {
                    optionStyle = "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full min-h-touch p-3 rounded-lg border text-left text-sm transition flex items-center justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${optionStyle}`}
                    >
                      <span>{opt}</span>
                      {hasAnswered && isThisCorrectOption && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                      )}
                      {hasAnswered && isThisSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Area */}
              {hasAnswered && (
                <div
                  className={`mt-3 p-3.5 rounded-lg border text-xs sm:text-sm ${
                    isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                      : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200"
                  }`}
                  role="status"
                >
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span>Great job! That&apos;s correct.</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        <span>Not quite — here is an easier way to understand it:</span>
                      </>
                    )}
                  </p>
                  {!isCorrect && (
                    <p className="mt-1 leading-relaxed">
                      {item.simpler_explanation}
                    </p>
                  )}
                </div>
              )}
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}
