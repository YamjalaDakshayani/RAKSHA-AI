"use client";

import React, { useRef, useState } from "react";
import { Camera, UploadCloud, X, ImageIcon, AlertCircle } from "lucide-react";
import { APP_CONFIG } from "@/config/app";
import { useAccessibility } from "@/lib/accessibilityContext";

interface ImageUploadProps {
  onImageSelected: (base64: string | null, mimeType?: string) => void;
  previewUrl: string | null;
}

export function ImageUpload({ onImageSelected, previewUrl }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { announce } = useAccessibility();

  /**
   * Resizes image client-side to max 1600px maintaining aspect ratio
   */
  const processAndResizeImage = (file: File) => {
    setError(null);
    setIsProcessing(true);

    if (file.size > APP_CONFIG.limits.maxImageBytes) {
      setError("File is too large. Please select a photo under 5 MB.");
      announce("File size exceeds 5 MB limit.");
      setIsProcessing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        const maxDim = APP_CONFIG.limits.maxImageDimension; // 1600px
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          onImageSelected(dataUrl, file.type);
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const compressedBase64 = canvas.toDataURL(mimeType, 0.85);

        onImageSelected(compressedBase64, mimeType);
        announce("Document photo successfully uploaded and optimized.");
        setIsProcessing(false);
      };

      img.onerror = () => {
        setError("Could not read image file. Please try another image.");
        setIsProcessing(false);
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      setError("Error reading file from your device.");
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndResizeImage(file);
    }
  };

  const handleClear = () => {
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    announce("Uploaded photo removed.");
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="sr-only"
        id="document-image-upload"
      />

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/50 dark:border-indigo-500/30 bg-zinc-950 p-2 shadow-lg">
          <div className="relative max-h-80 w-full flex items-center justify-center bg-zinc-900 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Document preview ready for analysis"
              className="max-h-80 w-auto object-contain rounded-lg"
            />
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              aria-label="Remove uploaded document photo"
              className="min-h-touch min-w-touch p-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-white transition"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <p className="text-center text-xs text-zinc-400 py-1.5 font-medium">
            Photo ready. Gemini will read the document directly without OCR.
          </p>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload document photo or capture with camera. Maximum size 5 MB."
          className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-zinc-50 dark:bg-zinc-900/40 hover:bg-indigo-50/50 dark:hover:bg-zinc-800/50 transition focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              {isProcessing ? (
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8" aria-hidden="true" />
              )}
            </div>

            <div>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isProcessing
                  ? "Optimizing photo..."
                  : "Tap to upload or take a photo of your notice"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                JPEG, PNG, or WebP up to 5 MB. Photos are never stored on our database.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="min-h-touch px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span>Camera / Gallery</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 p-3 rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
