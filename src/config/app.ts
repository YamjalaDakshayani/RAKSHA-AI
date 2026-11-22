export const APP_CONFIG = {
  name: "RAKSHA AI",
  assistantName: "RAKSHA AI",
  tagline: "Your Digital Safety Guardian",
  mission: "Detect threats. Prevent scams. Protect people.",
  headline: "Think Before You Click.",
  subheadline:
    "AI-powered cybersecurity assistant that protects students, job seekers, seniors, and everyday citizens against modern digital threats, fraudulent messages, phishing links, and deceptive QR codes.",
  description:
    "AI-powered cybersecurity assistant that protects students, job seekers, seniors, and everyday citizens against modern digital threats, fraudulent messages, phishing links, and deceptive QR codes.",
  disclaimer:
    "RAKSHA AI provides AI-based threat assessments and heuristic inspections. These results are analytical evaluations and do not constitute legal or absolute security guarantees. Always confirm sensitive fee demands, bank notices, or employment offers through verified official channels.",
  version: "2.0.0",
  limits: {
    maxTextChars: 8000,
    maxImageBytes: 5 * 1024 * 1024, // 5 MB
    maxImageDimension: 1600, // 1600 px client-side resize
    rateLimits: {
      guestDefault: 10,
      userDefault: 40,
      windowMinutesDefault: 10,
    },
  },
  trustInfo: {
    cybercrimeHelpline: "1930",
    cybercrimePortal: "cybercrime.gov.in",
    officialVerificationTip:
      "Always confirm fee notices or bank account details directly with your college administrative or scholarship office.",
  },
  contact: {
    helpline: "1930",
    portal: "cybercrime.gov.in",
    usHelpline: "1-800-CALL-FBI / ic3.gov",
  },
  languages: [
    { code: "en", name: "English", nativeName: "English", speechCode: "en-IN" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechCode: "hi-IN" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు", speechCode: "te-IN" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்", speechCode: "ta-IN" },
  ] as const,
  readingLevels: [
    { id: "simple", label: "Simple", description: "Clear everyday words and clear, concise steps" },
    { id: "very_simple", label: "Very Simple", description: "Short sentences, zero technical jargon, step-by-step" },
    { id: "child_friendly", label: "Child-friendly", description: "Warm analogies and easy words suitable for all learners" },
  ] as const,
  sampleScams: {
    internship: {
      title: "Fake Amazon / Google Remote Internship",
      category: "Job & Internship Fraud",
      type: "message",
      text: "Dear Student, Congratulations! You have been selected for the Google India Cloud Virtual Internship (Work From Home) with a monthly stipend of Rs. 45,000/-. Limited seats remaining! To confirm your appointment letter, pay a refundable document verification charge of Rs. 2,999/- via UPI to google-hr@okaxis within 2 hours. Click here to verify: http://google-careers-portal.live/apply?id=99281. Do not miss this exclusive opportunity!",
    },
    scholarship: {
      title: "Government Merit Scholarship Phishing",
      category: "Education Grant Scam",
      type: "message",
      text: "URGENT: Your application for PM Central Sector Merit Scholarship 2026 of Rs. 50,000 has been sanctioned by Ministry of Education. To receive the disbursement in your bank account today, verify your Aadhaar and submit OTP at: http://bit.ly/pm-scholarship-gov-claim. Failure to verify within 24 hours will lead to permanent cancellation of your scholarship.",
    },
    electricity: {
      title: "Urgent Electricity Disconnection Panic",
      category: "Urgency / Utility Scam",
      type: "message",
      text: "Dear Consumer, Your electricity power connection will be disconnected tonight at 9:30 PM from the power sub-station because your previous month bill was not updated in our server. Immediately call our Electricity Officer Mr. RK Sharma at 9876543210 or download our quick support APK to update your bill immediately.",
    },
    legitimate: {
      title: "Legitimate University Examination Schedule",
      category: "Safe Official Notice",
      type: "message",
      text: "Notice for All Semester Students: The end-term examinations for the Spring 2026 session will commence from December 15, 2026. The detailed datesheet and hall tickets have been uploaded to the official student portal at https://student.university.edu.in/portal. Students facing timetable clashes may write to controller.exams@university.edu.in by Dec 5.",
    },
  },
  sampleLinks: {
    typosquat: {
      label: "Typosquatting Lookalike Domain",
      url: "https://goog1e-security-verification.xyz/login?session=expire",
      type: "critical",
    },
    shortener: {
      label: "Obfuscated URL Shortener",
      url: "http://bit.ly/claim-free-recharge-2026",
      type: "high",
    },
    ipPhish: {
      label: "Raw IP Address Banking Phish",
      url: "http://192.168.1.105:8080/sbi-online/update-kyc.html",
      type: "critical",
    },
    legit: {
      label: "Safe Official Domain",
      url: "https://www.google.com",
      type: "safe",
    },
  },
};

export type SupportedLanguage = (typeof APP_CONFIG.languages)[number]["code"];
export type ReadingLevel = (typeof APP_CONFIG.readingLevels)[number]["id"];
