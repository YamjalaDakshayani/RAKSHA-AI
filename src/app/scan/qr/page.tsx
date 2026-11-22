"use client";

import React, { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import {
  QrCode,
  Camera,
  Upload,
  AlertTriangle,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
  Info,
  Layers,
} from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { RiskScoreMeter } from "@/components/RiskScoreMeter";
import { LinkAnalysis } from "@/lib/schemas";
import { storeScan } from "@/lib/scanStorage";

export default function QRGuardPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LinkAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop camera stream when switching away or unmounting
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Live Camera QR Scanning Loop
  const startCamera = async () => {
    setError(null);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        requestAnimationFrame(tickCamera);
      }
    } catch (err: any) {
      setError(
        "Camera permission was denied or camera is not available. You can upload a QR image directly using the Upload tab."
      );
      setCameraActive(false);
    }
  };

  const tickCamera = () => {
    if (
      videoRef.current &&
      videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
      canvasRef.current
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          stopCamera();
          setDecodedData(code.data);
          analyzeDecodedPayload(code.data);
          return;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tickCamera);
  };

  // Process File Upload QR
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setDecodedData(null);
    setAnalysis(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        if (!ctx) {
          setError("Failed to initialize canvas context.");
          return;
        }
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setDecodedData(code.data);
          analyzeDecodedPayload(code.data);
        } else {
          setError(
            "No QR code found in this image. Please upload a clear, high-contrast QR code image or try one of the demo buttons below."
          );
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Analyze the extracted QR payload
  const analyzeDecodedPayload = async (payload: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/scan/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: payload, scanType: "qr" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze decoded payload");
      }

      setAnalysis(data.analysis);

      // Save to scan storage
      await storeScan({
        scan_type: "qr",
        submitted_content: payload.slice(0, 300),
        risk_level: data.analysis.risk_level,
        risk_score: data.analysis.risk_score,
        findings: {
          domain: data.analysis.domain,
          protocol: data.analysis.protocol,
          is_https: data.analysis.is_https,
          is_shortener: data.analysis.is_shortener,
          is_ip_address: data.analysis.is_ip_address,
          is_suspicious_tld: data.analysis.is_suspicious_tld,
          warnings: data.analysis.warnings,
          explanation: data.analysis.explanation,
          recommendations: data.analysis.recommendations,
        },
        recommendation: data.analysis.recommendations[0] || "Do not visit unverified QR destination",
      });
    } catch (err: any) {
      setError(err.message || "Could not analyze QR payload.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Demo QR Loaders (Simulated QR payloads for quick hackathon review)
  const handleLoadDemoPayload = (type: "malicious" | "safe") => {
    stopCamera();
    const demoPayload =
      type === "malicious"
        ? "http://bit.ly/pm-scholarship-gov-claim"
        : "https://raksha-ai.gov.in/official-portal";

    setDecodedData(demoPayload);
    analyzeDecodedPayload(demoPayload);
  };

  const handleCopyPayload = () => {
    if (!decodedData) return;
    navigator.clipboard.writeText(decodedData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cyber-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-3">
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Guard (Anti-Quishing)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Safe QR Code Scanner & Quishing Detector
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
            Attackers paste rogue QR codes over parking meters, restaurant tables, and in emails to
            lure victims to phishing portals. RAKSHA AI extracts and inspects the payload in a safe
            sandbox—<strong>never auto-navigating</strong> to the destination.
          </p>
        </div>

        {/* Security Rule Pill */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-sky-500/30 text-xs text-slate-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-sky-300">Zero Auto-Redirect Guarantee:</strong> Default phone
            camera apps immediately open websites upon reading a QR code. RAKSHA AI intercepts the
            raw address, executes a forensic threat scan, and isolates you from malicious payloads.
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-800 space-x-4">
          <button
            onClick={() => {
              setActiveTab("upload");
              stopCamera();
            }}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === "upload"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload QR Image</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("camera");
              startCamera();
            }}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === "camera"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Live Camera Scanner</span>
          </button>
        </div>

        {/* Upload View */}
        {activeTab === "upload" && (
          <div className="glass-card p-8 rounded-2xl text-center space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-10 cursor-pointer transition flex flex-col items-center justify-center space-y-3 group"
            >
              <div className="p-4 rounded-full bg-slate-900 border border-slate-800 group-hover:border-cyan-400 transition">
                <QrCode className="w-10 h-10 text-cyan-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition">
                  Click to select a QR code screenshot or photo
                </span>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, or SVG accepted</p>
              </div>
            </div>

            {/* Quick Demo QR Test Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">Or test instantly:</span>
              <button
                type="button"
                onClick={() => handleLoadDemoPayload("malicious")}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-950/60 text-red-300 border border-red-500/40 hover:bg-red-900/50 transition inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Test Malicious Quishing Link (bit.ly)</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadDemoPayload("safe")}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/50 transition inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Safe Official QR</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Camera View */}
        {activeTab === "camera" && (
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="relative max-w-md mx-auto aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning visual overlay */}
              {cameraActive && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-cyan-400/80 rounded-xl relative shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400 animate-scan-line shadow-[0_0_8px_#00F0FF]" />
                  </div>
                </div>
              )}

              {!cameraActive && (
                <div className="p-4 text-center text-xs text-slate-400">
                  Camera paused or inactive. Click below to start.
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              {cameraActive ? (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 rounded-lg bg-red-950 border border-red-500/40 text-red-400 text-xs font-bold"
                >
                  Stop Camera
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="btn-cyber-primary px-6 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Camera</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Extracted QR Payload & Threat Analysis */}
        {decodedData && (
          <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracted QR Destination (Raw Payload)
              </span>
              <div className="mt-2 p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-between gap-3 font-mono text-xs text-cyan-300 break-all">
                <span>{decodedData}</span>
                <button
                  onClick={handleCopyPayload}
                  className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition flex-shrink-0"
                  title="Copy address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isAnalyzing && (
              <div className="p-6 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-xs text-slate-400">
                  Executing forensic heuristic threat inspection on extracted payload...
                </div>
              </div>
            )}

            {analysis && (
              <div className="space-y-6 pt-4 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Target Destination Threat Assessment
                    </span>
                    <div className="mt-1 flex items-center gap-3">
                      <RiskBadge level={analysis.risk_level} size="lg" />
                      <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-700">
                        {analysis.domain}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1 flex justify-center">
                    <RiskScoreMeter score={analysis.risk_score} level={analysis.risk_level} />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Destination Safety Verdict
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {analysis.explanation}
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                      <span className="text-xs font-bold text-slate-300 uppercase">
                        Recommendation:
                      </span>
                      <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                        {analysis.recommendations[0]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warnings list if any */}
                {analysis.warnings.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-red-400">
                      Flagged Concerns:
                    </div>
                    <ul className="space-y-1.5">
                      {analysis.warnings.map((warn, i) => (
                        <li
                          key={i}
                          className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                          <span>{warn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
