import React from "react";
import type { Metadata } from "next";
import { APP_CONFIG } from "@/config/app";
import { TalkToNova } from "@/components/TalkToNova";

export const metadata: Metadata = {
  title: `Talk to ${APP_CONFIG.assistantName} | Multilingual Voice Companion`,
  description:
    "Hands-free voice assistant for college students and parents. Talk with Nova about college circulars, scholarships, exams, and cyber fraud in Telugu, Hindi, Tamil, or English.",
};

export default function TalkPage() {
  return <TalkToNova />;
}
