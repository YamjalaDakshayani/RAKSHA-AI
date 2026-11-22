import { describe, it, expect } from "vitest";
import {
  AnalyzeRequestSchema,
  AnalyzeResponseSchema,
  FollowUpRequestSchema,
  ChatRequestSchema,
  FeedbackRequestSchema,
} from "@/lib/schemas";

describe("Zod Validation Schemas", () => {
  describe("AnalyzeRequestSchema", () => {
    it("accepts valid text request", () => {
      const valid = {
        text: "Please submit your scholarship form before November 30.",
        language: "en",
        level: "simple",
      };
      const result = AnalyzeRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("accepts valid image request without text", () => {
      const valid = {
        imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        imageMime: "image/png",
        language: "te",
        level: "very_simple",
      };
      const result = AnalyzeRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects empty request with neither text nor image", () => {
      const empty = {
        language: "en",
        level: "simple",
      };
      const result = AnalyzeRequestSchema.safeParse(empty);
      expect(result.success).toBe(false);
    });

    it("rejects text exceeding 8,000 characters limit", () => {
      const oversized = {
        text: "a".repeat(8001),
        language: "hi",
        level: "simple",
      };
      const result = AnalyzeRequestSchema.safeParse(oversized);
      expect(result.success).toBe(false);
    });

    it("rejects unsupported languages", () => {
      const invalidLang = {
        text: "Some notice",
        language: "fr", // French is not supported
      };
      const result = AnalyzeRequestSchema.safeParse(invalidLang);
      expect(result.success).toBe(false);
    });
  });

  describe("AnalyzeResponseSchema", () => {
    it("validates full AI response schema correctly", () => {
      const fullResponse = {
        title: "Semester Exam Fee Circular",
        summary: "Notice regarding semester end examinations and fees.",
        steps: ["Pay Rs 1200", "Submit receipt"],
        deadline: "December 3, 2025",
        documents_needed: ["SBI Collect receipt", "ERP login"],
        risks_if_ignored: "Hall ticket will not be generated.",
        trust_check: {
          verdict: "genuine",
          reason: "Official university circular via SBI Collect portal.",
          tip: "Never pay fees to personal UPI IDs.",
        },
        glossary: [{ term: "ERP", meaning: "College student login portal" }],
        quiz: [
          {
            question: "How should fees be paid?",
            options: ["SBI Collect", "Personal UPI"],
            answer_index: 0,
            simpler_explanation: "Only use official college portal.",
          },
        ],
        draft_reply: "Dear Controller of Exams, I have paid the fee.",
      };

      const result = AnalyzeResponseSchema.safeParse(fullResponse);
      expect(result.success).toBe(true);
    });

    it("rejects invalid trust_check verdict", () => {
      const invalid = {
        title: "Title",
        summary: "Summary",
        steps: ["Step 1"],
        deadline: "Tomorrow",
        documents_needed: [],
        risks_if_ignored: "Risk",
        trust_check: {
          verdict: "safe", // Must be 'genuine' | 'careful' | 'scam'
          reason: "Reason",
          tip: "Tip",
        },
        glossary: [{ term: "A", meaning: "B" }],
        quiz: [
          {
            question: "Q",
            options: ["A", "B"],
            answer_index: 0,
            simpler_explanation: "Expl",
          },
        ],
        draft_reply: "Draft",
      };

      const result = AnalyzeResponseSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("FollowUpRequestSchema", () => {
    it("validates follow-up request", () => {
      const valid = {
        documentContext: "Title: Exam Fee. Deadline: Dec 3.",
        question: "Can I pay in cash?",
        language: "te",
        level: "simple",
      };
      const result = FollowUpRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects empty question", () => {
      const emptyQ = {
        documentContext: "Context",
        question: "",
      };
      const result = FollowUpRequestSchema.safeParse(emptyQ);
      expect(result.success).toBe(false);
    });
  });

  describe("ChatRequestSchema", () => {
    it("validates talk to nova message", () => {
      const valid = {
        message: "How do I apply for scholarship renewal?",
        language: "hi",
        level: "very_simple",
      };
      const result = ChatRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe("FeedbackRequestSchema", () => {
    it("validates thumbs up and thumbs down rating", () => {
      expect(FeedbackRequestSchema.safeParse({ rating: "up" }).success).toBe(true);
      expect(FeedbackRequestSchema.safeParse({ rating: "down", comment: "More detail please" }).success).toBe(true);
      expect(FeedbackRequestSchema.safeParse({ rating: "neutral" }).success).toBe(false);
    });
  });
});
