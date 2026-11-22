import { SupportedLanguage, ReadingLevel } from "@/config/app";
import { AnalyzeResult } from "./schemas";

export interface SampleDocument {
  id: "scholarship" | "exam_fee" | "scam_alert";
  label: string;
  badge: string;
  description: string;
  rawText: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: "scholarship",
    label: "Scholarship Notice",
    badge: "Official Notice",
    description: "Post-matric financial aid notification with document checklist and strict submission deadline.",
    rawText: `OFFICE OF THE COMMISSIONER OF COLLEGIATE EDUCATION
GOVERNMENT OF TELANGANA / NATIONAL SCHOLARSHIP PORTAL
CIRCULAR NO: ED/SCHOL/2025-26/04

Subject: Mandatory Submission of Post-Matric Scholarship Applications for AY 2025-26.

All eligible SC, ST, BC, EBC, and Minority undergraduate and postgraduate students enrolled in recognized government and private affiliated colleges are hereby notified that the online scholarship portal (ePASS / NSP) is currently open for renewal and fresh registrations.

Key Requirements:
1. Online submission must be completed on or before November 30, 2025, 5:00 PM. No physical or late applications will be entertained under any circumstances.
2. Required documents to be uploaded:
   - MeeSeva Income Certificate issued on or after April 1, 2025 (Annual parental income below Rs. 2,00,000 for SC/ST and Rs. 1,50,000 for BC/EBC).
   - Integrated Caste Certificate with barcoded C-number.
   - Previous year marks memo / CMM.
   - Bank Account Passbook (must be Aadhaar-seeded NPCI mapped account).
   - College Bonafide / Study Certificate issued by Principal.
3. Verification: Hard copies along with original certificates must be verified by the College Administrative Officer by December 5, 2025.

Failure to apply before the deadline will result in total forfeiture of tuition fee reimbursement and maintenance allowance for the entire academic year.

Sd/-
Joint Director (Scholarships)
Contact: helpdesk@telanganaepass.cgg.gov.in | 040-23390228`,
  },
  {
    id: "exam_fee",
    label: "Exam Fee Circular",
    badge: "Academic Circular",
    description: "Semester examination fee schedule, penalty dates, and hall ticket release guidelines.",
    rawText: `UNIVERSITY EXAMINATION BRANCH
CENTRAL CONTROLLER OF EXAMINATIONS
NOTIFICATION: EXAM/SEM-END/NOV-2025

Sub: B.Tech / B.Sc / B.Com 3rd & 5th Semester Regular & Supplementary Examinations Fee Payment Schedule.

It is hereby informed to all students that the End-Semester Theory and Practical Examinations are scheduled to commence from January 6, 2026. The prescribed fee payment schedule is as follows:

Fee Details:
- Whole Examination Fee (Regular): Rs. 1,200/-
- Supplementary per paper: Rs. 400/- (Max Rs. 1,200/-)
- Late fee with Rs. 100/- fine: Up to December 10, 2025.
- Late fee with Rs. 500/- super fine: Up to December 15, 2025.

Last Date without fine: December 3, 2025 (Strictly 5:00 PM).

Mode of Payment:
All examination fees must be paid exclusively through the Official College Student Portal (ERP) via SBI Collect. Cash, DD, Cheques, or third-party UPI transfers are strictly prohibited. The College Finance Section is not responsible for any payment made to personal accounts.

Hall Ticket Eligibility:
Students must have a minimum of 75% aggregate attendance. Hall tickets can be downloaded from the university portal starting January 2, 2026, upon clearance of library dues and exam fee receipt verification.

Sd/-
Controller of Examinations`,
  },
  {
    id: "scam_alert",
    label: "Suspicious Payment Alert",
    badge: "Urgent Warning",
    description: "Fraudulent threat SMS demanding immediate fee payment to a personal UPI address.",
    rawText: `URGENT NOTICE FROM SCHOLARSHIP DEPARTMENT:
Your government scholarship for 2025-26 will be permanently CANCELLED today due to pending verification fee!

You must pay Rs. 500 processing verification fee within 2 hours to avoid debarment and penalty.
Click this link to pay immediately: http://scholarship-fee-urgent.pay-upi.cc/pay?id=admin9823
Or send money directly via PhonePe/GPay to 9876543210@paytm.

If you do not pay, your college admission will be cancelled and police report filed.
Do not reply to this message.`,
  },
];

// Multilingual and multi-level precomputed cache
type CacheKey = `${"scholarship" | "exam_fee" | "scam_alert"}_${SupportedLanguage}_${ReadingLevel}`;

export const PRECOMPUTED_SAMPLE_RESULTS: Record<string, AnalyzeResult> = {
  // 1. SCHOLARSHIP - ENGLISH - SIMPLE
  "scholarship_en_simple": {
    title: "Government Post-Matric Scholarship Notice 2025-26",
    summary:
      "This is an official notice for eligible college students to apply for government tuition fee reimbursement and living allowance for the 2025-26 academic year.",
    steps: [
      "1. Check if your parental income is within the required limit (below Rs. 2,00,000 for SC/ST or Rs. 1,50,000 for BC/EBC).",
      "2. Gather your documents: Income Certificate, Caste Certificate, Marksheet, Bonafide, and Bank Passbook.",
      "3. Make sure your bank account is linked to your Aadhaar card with NPCI mapping.",
      "4. Submit your online application on ePASS or the National Scholarship Portal before November 30, 2025.",
      "5. Bring physical copies and original certificates to your college administrative office by December 5, 2025.",
    ],
    deadline: "November 30, 2025, by 5:00 PM (College verification by December 5, 2025)",
    documents_needed: [
      "MeeSeva Income Certificate issued on or after April 1, 2025",
      "Integrated Caste Certificate with C-number",
      "Previous year marks memo / CMM",
      "Aadhaar-seeded bank passbook copy",
      "Principal's Study/Bonafide Certificate",
    ],
    risks_if_ignored:
      "If you do not apply before the deadline, you will lose your tuition fee waiver and monthly allowance for the whole year, and you will have to pay the college fees yourself.",
    trust_check: {
      verdict: "genuine",
      reason:
        "This circular comes from the official Collegiate Education department, uses official portal links (ePASS/NSP), lists an official government email domain, and requires verification at your college counter.",
      tip: "Always submit scholarship forms on official government portals (.gov.in). Never pay any application fee to outside agents.",
    },
    glossary: [
      {
        term: "Post-Matric",
        meaning: "Studies completed after finishing Class 10 (such as Intermediate, Diploma, Degree, or PG).",
      },
      {
        term: "NPCI Mapped",
        meaning: "Your bank account is linked with your Aadhaar so government benefit funds can arrive automatically.",
      },
      {
        term: "Bonafide Certificate",
        meaning: "An official letter signed by your college principal confirming you are a genuine enrolled student.",
      },
    ],
    quiz: [
      {
        question: "What is the final date to submit your online scholarship application?",
        options: ["November 30, 2025", "December 5, 2025", "April 1, 2025"],
        answer_index: 0,
        simpler_explanation:
          "Think of November 30 as your deadline line. You must complete your online form by November 30, and only show your papers to college by December 5.",
      },
      {
        question: "Which condition must your bank account satisfy?",
        options: [
          "It must be seeded with Aadhaar and NPCI mapped",
          "It must have at least Rs. 50,000 balance",
          "It must be opened in a private international bank",
        ],
        answer_index: 0,
        simpler_explanation:
          "The government sends money directly through Aadhaar. If your bank isn't linked to Aadhaar, the money will bounce back.",
      },
    ],
    draft_reply:
      "Respected Principal / Scholarship Officer,\n\nI am an enrolled student applying for the Post-Matric Scholarship (AY 2025-26). I have successfully submitted my online ePASS application and attached my income, caste, bonafide, and Aadhaar-seeded bank documents. Please kindly verify my application.\n\nThank you,\n[Your Name]\n[Roll Number]",
  },

  // 1. SCHOLARSHIP - HINDI - SIMPLE
  "scholarship_hi_simple": {
    title: "सरकारी पोस्ट-मैट्रिक छात्रवृत्ति सूचना 2025-26",
    summary:
      "यह सरकारी सूचना कॉलेज के पात्र विद्यार्थियों के लिए 2025-26 शैक्षणिक वर्ष की ट्यूशन फीस छूट और छात्रवृत्ति के लिए ऑनलाइन आवेदन करने हेतु है।",
    steps: [
      "1. जांचें कि आपकी पारिवारिक आय तय सीमा के अंदर हो (SC/ST के लिए ₹2,00,000 और BC के लिए ₹1,50,000 से कम)।",
      "2. जरूरी कागजात एकत्र करें: आय प्रमाण पत्र, जाति प्रमाण पत्र, अंकतालिका और बैंक पासबुक।",
      "3. सुनिश्चित करें कि आपका बैंक खाता आधार कार्ड और NPCI से जुड़ा हुआ है।",
      "4. 30 नवंबर 2025 शाम 5 बजे से पहले ePASS या नेशनल स्कॉलरशिप पोर्टल पर फॉर्म भरें।",
      "5. 5 दिसंबर 2025 तक अपने कॉलेज ऑफिस में असली कागजात दिखाकर पुष्टि करवाएं।",
    ],
    deadline: "30 नवंबर 2025, शाम 5:00 बजे (कॉलेज में सत्यापन 5 दिसंबर 2025 तक)",
    documents_needed: [
      "1 अप्रैल 2025 के बाद जारी आय प्रमाण पत्र",
      "जाति प्रमाण पत्र (बारकोड वाला)",
      "पिछले वर्ष की अंकतालिका (Marksheet)",
      "आधार से लिंक बैंक पासबुक",
      "कॉलेज बोनाफाइड (अध्ययन) प्रमाण पत्र",
    ],
    risks_if_ignored:
      "यदि आप समय पर आवेदन नहीं करेंगे तो आपको इस साल कोई छात्रवृत्ति नहीं मिलेगी और आपको कॉलेज की पूरी फीस खुद भरनी होगी।",
    trust_check: {
      verdict: "genuine",
      reason:
        "यह नोटिस सरकारी शिक्षा विभाग की ओर से है। इसमें आधिकारिक पोर्टल और सरकारी ईमेल पता दिया गया है।",
      tip: "हमेशा सरकारी वेबसाइट (.gov.in) पर ही फॉर्म भरें। किसी भी बाहरी व्यक्ति को पैसे न दें।",
    },
    glossary: [
      {
        term: "पोस्ट-मैट्रिक (Post-Matric)",
        meaning: "दसवीं कक्षा पास करने के बाद की जाने वाली पढ़ाई (जैसे डिप्लोमा, डिग्री, आदि)।",
      },
      {
        term: "NPCI मैपिंग",
        meaning: "बैंक खाते का आधार से जुड़ना, ताकि सरकारी छात्रवृत्ति सीधे आपके खाते में आ सके।",
      },
      {
        term: "बोनाफाइड (Bonafide)",
        meaning: "प्रिंसिपल का हस्ताक्षर किया हुआ प्रमाण पत्र जो साबित करता है कि आप उस कॉलेज के छात्र हैं।",
      },
    ],
    quiz: [
      {
        question: "ऑनलाइन स्कॉलरशिप फॉर्म भरने की अंतिम तारीख क्या है?",
        options: ["30 नवंबर 2025", "5 दिसंबर 2025", "1 जनवरी 2026"],
        answer_index: 0,
        simpler_explanation:
          "30 नवंबर फॉर्म भरने का आखिरी दिन है। कॉलेज में कागज दिखाने के लिए 5 दिसंबर तक का समय है।",
      },
      {
        question: "बैंक खाते के लिए सबसे जरूरी क्या है?",
        options: ["आधार और NPCI से लिंक होना", "खाते में ₹10,000 होना", "सिर्फ क्रेडिट कार्ड होना"],
        answer_index: 0,
        simpler_explanation:
          "सरकार सीधे आधार नंबर पर पैसा भेजती है। यदि बैंक आधार से नहीं जुड़ा होगा, तो पैसा नहीं आएगा।",
      },
    ],
    draft_reply:
      "आदरणीय प्राचार्य महोदय / छात्रवृत्ति अधिकारी,\n\nमैंने शैक्षणिक वर्ष 2025-26 के लिए पोस्ट-मैट्रिक स्कॉलरशिप का ऑनलाइन फॉर्म भर दिया है। मैंने आय, जाति और आधार लिंक बैंक पासबुक की प्रतियां संलग्न कर दी हैं। कृपया मेरे आवेदन का सत्यापन करने की कृपा करें।\n\nधन्यवाद,\n[आपका नाम]\n[रोल नंबर]",
  },

  // 1. SCHOLARSHIP - TELUGU - SIMPLE
  "scholarship_te_simple": {
    title: "ప్రభుత్వ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ నోటీసు 2025-26",
    summary:
      "ఇది 2025-26 విద్యా సంవత్సరానికి కళాశాల విద్యార్థులు ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ మరియు స్కాలర్‌షిప్ కోసం దరఖాస్తు చేసుకోవడానికి అధికారిక ప్రకటన.",
    steps: [
      "1. మీ తల్లిదండ్రుల వార్షిక ఆదాయం నిర్దేశిత పరిమితిలో ఉందో లేదో సరిచూసుకోండి (SC/ST లకు రూ. 2 లక్షల లోపు, BC/EBC లకు రూ. 1.5 లక్షల లోపు).",
      "2. అవసరమైన పత్రాలను సిద్ధం చేసుకోండి: ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం, మార్కుల జాబితా మరియు బ్యాంక్ పాస్‌బుక్.",
      "3. మీ బ్యాంక్ ఖాతాకు ఆధార్ మరియు NPCI లింక్ అయి ఉండేలా చూసుకోండి.",
      "4. నవంబర్ 30, 2025 సాయంత్రం 5 గంటలలోపు ePASS లేదా నేషనల్ స్కాలర్‌షిప్ పోర్టల్‌లో దరఖాస్తు చేయండి.",
      "5. డిసెంబర్ 5, 2025 లోపు మీ కళాశాల కార్యాలయంలో అసలు పత్రాలను చూపించి ధృవీకరణ పూర్తి చేయండి.",
    ],
    deadline: "నవంబర్ 30, 2025 సాయంత్రం 5:00 గంటలు (కాలేజీ ధృవీకరణ: డిసెంబర్ 5, 2025)",
    documents_needed: [
      "ఏప్రిల్ 1, 2025 తర్వాత తీసుకున్న మీసేవ ఆదాయ ధృవీకరణ పత్రం",
      "బార్‌కోడ్ కలిగిన కుల ధృవీకరణ పత్రం",
      "క్రితం సంవత్సరం మార్కుల మెమో",
      "ఆధార్ సీడింగ్ అయిన బ్యాంక్ పాస్‌బుక్ కాపీ",
      "ప్రిన్సిపాల్ జారీ చేసిన స్టడీ/బోనఫైడ్ సర్టిఫికెట్",
    ],
    risks_if_ignored:
      "గడువులోగా దరఖాస్తు చేసుకోకపోతే ఆ సంవత్సరం ఫీజు రీయింబర్స్మెంట్ రాదు, మీరే కాలేజీ ఫీజు మొత్తం చెల్లించాల్సి ఉంటుంది.",
    trust_check: {
      verdict: "genuine",
      reason:
        "ఈ సర్క్యులర్ ఉన్నత విద్యా శాఖ నుండి వచ్చింది, అధికారిక ePASS పోర్టల్ మరియు ప్రభుత్వ ఈమెయిల్ ఇందులో ఉన్నాయి.",
      tip: "ఎల్లప్పుడూ అధికారిక ప్రభుత్వ వెబ్‌సైట్లలో మాత్రమే దరఖాస్తు చేసుకోండి. ఎవరికీ ఎలాంటి లంచాలు ఇవ్వకండి.",
    },
    glossary: [
      {
        term: "పోస్ట్-మెట్రిక్ (Post-Matric)",
        meaning: "10వ తరగతి పూర్తయిన తర్వాత చేసే చదువులు (ఇంటర్, డిగ్రీ, పీజీ మొదలైనవి).",
      },
      {
        term: "NPCI సీడింగ్ (Aadhaar Mapping)",
        meaning: "ప్రభుత్వ డబ్బు నేరుగా మీ ఖాతాలో పడేందుకు బ్యాంక్ ఖాతాను ఆధార్‌తో అనుసంధానించడం.",
      },
      {
        term: "బోనఫైడ్ సర్టిఫికెట్",
        meaning: "మీరు ఆ కాలేజీలో చదువుతున్నారని ప్రిన్సిపాల్ ఇచ్చే స్టడీ సర్టిఫికెట్.",
      },
    ],
    quiz: [
      {
        question: "స్కాలర్‌షిప్ ఆన్‌లైన్ దరఖాస్తుకు చివరి తేదీ ఏది?",
        options: ["నవంబర్ 30, 2025", "డిసెంబర్ 5, 2025", "జనవరి 1, 2026"],
        answer_index: 0,
        simpler_explanation:
          "నవంబర్ 30 ఆన్‌లైన్ ఫారమ్ నింపడానికి చివరి రోజు. కాలేజీలో కాగితాలు ఇవ్వడానికి డిసెంబర్ 5 వరకు గడువు ఉంది.",
      },
      {
        question: "బ్యాంక్ ఖాతాకు ఏది తప్పనిసరిగా ఉండాలి?",
        options: ["ఆధార్ మరియు NPCI లింక్", "ఖాతాలో రూ. 10,000 నిల్వ", "ఏటీఎం కార్డు మాత్రమే"],
        answer_index: 0,
        simpler_explanation:
          "ప్రభుత్వం ఆధార్ నంబర్ ద్వారానే నగదు జమ చేస్తుంది. కాబట్టి ఆధార్ లింక్ తప్పనిసరి.",
      },
    ],
    draft_reply:
      "గౌరవనీయులైన ప్రిన్సిపాల్ గారికి / స్కాలర్‌షిప్ అధికారి గారికి,\n\nనేను 2025-26 విద్యా సంవత్సరానికి పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ ఆన్‌లైన్ దరఖాస్తును సమర్పించాను. ఆదాయ, కుల ధృవీకరణ పత్రాలు మరియు బ్యాంక్ పాస్‌బుక్ జత చేశాను. దయచేసి నా దరఖాస్తును ధృవీకరించవలసిందిగా కోరుతున్నాను.\n\nధన్యవాదాలు,\n[మీ పేరు]\n[రోల్ నంబర్]",
  },

  // 1. SCHOLARSHIP - TAMIL - SIMPLE
  "scholarship_ta_simple": {
    title: "அரசு போஸ்ட்-மெட்ரிக் கல்வி உதவித்தொகை அறிவிப்பு 2025-26",
    summary:
      "இது 2025-26 கல்வியாண்டிற்கான கல்லூரி மாணவர்களுக்கான கல்வி கட்டண சலுகை மற்றும் உதவித்தொகை விண்ணப்ப அறிவிப்பாகும்.",
    steps: [
      "1. உங்கள் குடும்ப ஆண்டு வருமானம் வரம்பிற்குள் உள்ளதா என சரிபார்க்கவும் (SC/ST ரூ. 2 லட்சம், BC/EBC ரூ. 1.5 லட்சத்திற்குள்).",
      "2. வருமான சான்றிதழ், சாதி சான்றிதழ், மதிப்பெண் பட்டியல் மற்றும் வங்கி பாஸ்புத்தகம் ஆகியவற்றை தயார் செய்யவும்.",
      "3. உங்கள் வங்கி கணக்கு ஆதாருடன் (NPCI) இணைக்கப்பட்டுள்ளதை உறுதிப்படுத்தவும்.",
      "4. நவம்பர் 30, 2025 மாலை 5 மணிக்குள் தேசிய ஸ்காலர்ஷிப் போர்ட்டலில் விண்ணப்பிக்கவும்.",
      "5. டிசம்பர் 5, 2025க்குள் கல்லூரி அலுவலகத்தில் சான்றிதழ்களை சமர்ப்பித்து சரிபார்க்கவும்.",
    ],
    deadline: "நவம்பர் 30, 2025 மாலை 5:00 மணி (கல்லூரி சரிபார்ப்பு: டிசம்பர் 5, 2025)",
    documents_needed: [
      "ஏப்ரல் 1, 2025க்குப் பிறகு பெறப்பட்ட வருமான சான்றிதழ்",
      "சாதி சான்றிதழ்",
      "முந்தைய ஆண்டு மதிப்பெண் சான்றிதழ்",
      "ஆதார் இணைக்கப்பட்ட வங்கி பாஸ்புக்",
      "கல்லூரி படிப்பு சான்றிதழ் (Bonafide)",
    ],
    risks_if_ignored:
      "கடைசி தேதிக்குள் விண்ணப்பிக்காவிட்டால் உதவித்தொகை கிடைக்காது, நீங்களே முழுக் கட்டணத்தையும் செலுத்த வேண்டி வரும்.",
    trust_check: {
      verdict: "genuine",
      reason:
        "இது உயர்கல்வித் துறையின் அதிகாரப்பூர்வ சுற்றறிக்கை. இதில் அரசு இணையதளம் மற்றும் மின்னஞ்சல் கொடுக்கப்பட்டுள்ளது.",
      tip: "எப்போதும் அரசு இணையதளத்தில் (.gov.in) மட்டுமே விண்ணப்பிக்கவும். இடைத்தரகர்களுக்கு பணம் கொடுக்க வேண்டாம்.",
    },
    glossary: [
      {
        term: "போஸ்ட்-மெட்ரிக் (Post-Matric)",
        meaning: "பத்தாம் வகுப்பு முடித்த பிறகு படிக்கும் படிப்புகள் (டிப்ளமோ, பட்டப்படிப்பு போன்றவை).",
      },
      {
        term: "NPCI இணைப்பு",
        meaning: "அரசு உதவித்தொகை நேரடியாக உங்கள் கணக்கில் வர ஆதார் மற்றும் வங்கி கணக்கை இணைப்பது.",
      },
      {
        term: "போனஃபைட் (Bonafide) சான்றிதழ்",
        meaning: "நீங்கள் கல்லூரியின் உண்மை மாணவர் என்பதை உறுதிப்படுத்தும் முதல்வர் கையொப்பமிட்ட சான்றிதழ்.",
      },
    ],
    quiz: [
      {
        question: "ஆன்லைனில் விண்ணப்பிக்க கடைசி நாள் எது?",
        options: ["நவம்பர் 30, 2025", "டிசம்பர் 5, 2025", "ஜனவரி 1, 2026"],
        answer_index: 0,
        simpler_explanation:
          "நவம்பர் 30 விண்ணப்பம் செய்ய கடைசி நாள். டிசம்பர் 5 கல்லூரியில் ஆவணங்களை சமர்ப்பிக்க இறுதி நாள்.",
      },
      {
        question: "வங்கி கணக்கில் என்ன இணைக்கப்பட்டிருக்க வேண்டும்?",
        options: ["ஆதார் மற்றும் NPCI மேப்பிங்", "குறைந்தபட்சம் ரூ. 10,000", "கிரெடிட் கார்டு"],
        answer_index: 0,
        simpler_explanation:
          "அரசு நேரடியாக ஆதார் மூலம் பணம் அனுப்புவதால் ஆதார் இணைப்பு மிக அவசியம்.",
      },
    ],
    draft_reply:
      "மரியாதைக்குரிய முதல்வர் / உதவித்தொகை அதிகாரி அவர்களுக்கு,\n\nநான் 2025-26 ஆண்டிற்கான கல்வி உதவித்தொகைக்கு ஆன்லைனில் விண்ணப்பித்துள்ளேன். தேவையான ஆவணங்களை இணைத்துள்ளேன். எனது விண்ணப்பத்தை சரிபார்த்து அங்கீகரிக்குமாறு கேட்டுக்கொள்கிறேன்.\n\nநன்றி,\n[உங்கள் பெயர்]\n[பதிவு எண்]",
  },

  // 2. EXAM FEE - ENGLISH - SIMPLE
  "exam_fee_en_simple": {
    title: "University Semester Exam Fee & Hall Ticket Notice",
    summary:
      "This circular explains the regular semester exam fees, late fee penalty dates, and hall ticket release conditions for undergraduate and postgraduate students.",
    steps: [
      "1. Pay your regular exam fee of Rs. 1,200 before December 3, 2025, 5:00 PM.",
      "2. If missed, pay with a Rs. 100 late fee up to December 10, or Rs. 500 late fee up to December 15.",
      "3. Pay only through your college ERP student portal using SBI Collect.",
      "4. Do not make cash, DD, or personal UPI payments.",
      "5. Ensure your class attendance is at least 75% to download your hall ticket on January 2, 2026.",
    ],
    deadline: "December 3, 2025 without late fine (Final with super late fine: December 15, 2025)",
    documents_needed: [
      "College Student Portal / ERP Login credentials",
      "Exam fee payment receipt from SBI Collect",
      "Library clearance / No-Dues slip",
    ],
    risks_if_ignored:
      "If you do not pay the exam fee before December 15, you cannot appear in semester examinations and your hall ticket will not be generated.",
    trust_check: {
      verdict: "genuine",
      reason:
        "Standard university examination controller notification with strict institutional payment methods (SBI Collect ERP) and explicit prohibition of personal UPI transfers.",
      tip: "Never transfer college exam fees to any personal Google Pay or PhonePe mobile number.",
    },
    glossary: [
      {
        term: "Supplementary Exam",
        meaning: "A re-exam for students who need to clear subjects they failed in previous semesters.",
      },
      {
        term: "SBI Collect",
        meaning: "The official State Bank of India online fee collection portal used by government colleges.",
      },
      {
        term: "Aggregate Attendance",
        meaning: "The total percentage of classes you attended across all your subjects combined.",
      },
    ],
    quiz: [
      {
        question: "How should you pay the exam fees?",
        options: [
          "Exclusively through the college ERP via SBI Collect",
          "By sending money to the professor's personal UPI number",
          "By cash at an outside cyber cafe",
        ],
        answer_index: 0,
        simpler_explanation:
          "Always use the official college student portal. The university never accepts cash or personal UPI transfers.",
      },
      {
        question: "What minimum attendance is required to get a hall ticket?",
        options: ["75% aggregate attendance", "50% attendance", "No minimum attendance"],
        answer_index: 0,
        simpler_explanation:
          "You must attend at least 3 out of every 4 classes (75%) to be allowed to sit for semester exams.",
      },
    ],
    draft_reply:
      "Dear Controller of Examinations,\n\nI have successfully paid my Semester Examination Fee of Rs. 1,200 via SBI Collect through the college portal. My transaction reference number is attached. Kindly ensure my payment is cleared for hall ticket generation.\n\nRegards,\n[Your Name]\n[Roll Number]",
  },

  // 3. SCAM ALERT - ENGLISH - SIMPLE
  "scam_alert_en_simple": {
    title: "Suspicious Payment Alert: Urgent Scholarship Threat",
    summary:
      "This is an unofficial, highly suspicious fraudulent message threatening sudden cancellation and demanding a Rs. 500 fee via an unverified link or personal UPI.",
    steps: [
      "1. DO NOT click the link and DO NOT send Rs. 500 to the phone number or UPI ID.",
      "2. Do not panic: government departments and colleges never cancel scholarships with a 2-hour SMS threat.",
      "3. Show this message to your college scholarship clerk or administrative office immediately to verify.",
      "4. Report this fraudulent message and the UPI phone number to the National Cybercrime Helpline at 1930 or file a report at cybercrime.gov.in.",
    ],
    deadline: "No legitimate deadline (The 2-hour deadline in the message is a fake scare tactic)",
    documents_needed: [
      "Screenshot of the suspicious SMS or WhatsApp message",
      "Your genuine college scholarship application acknowledgment slip",
    ],
    risks_if_ignored:
      "If you pay the Rs. 500, the scammers will steal your money and may attempt to drain more funds from your bank account.",
    trust_check: {
      verdict: "scam",
      reason:
        "Multiple severe red flags: high-pressure threats ('within 2 hours'), demanding money to a personal UPI address (9876543210@paytm), fake domain (pay-upi.cc), and threats of police action.",
      tip: "Government scholarship verification is completely free. Immediately report cyber extortion and phishing to 1930 or cybercrime.gov.in.",
    },
    glossary: [
      {
        term: "Phishing / Cyber Fraud",
        meaning: "A trick where criminals pretend to be an official department to scare you into sending them money.",
      },
      {
        term: "UPI ID",
        meaning: "A virtual payment address. Personal UPI IDs ending in @paytm or phone numbers are never official government payment channels.",
      },
    ],
    quiz: [
      {
        question: "What should you do if you receive an SMS demanding Rs. 500 for scholarship verification?",
        options: [
          "Do not pay; report it to your college and the cybercrime helpline (1930)",
          "Pay Rs. 500 immediately because of the 2-hour warning",
          "Send your bank password and Aadhaar OTP to check",
        ],
        answer_index: 0,
        simpler_explanation:
          "Scammers use fake time limits to make you panic. Government verification is free—never send money to personal UPI links.",
      },
    ],
    draft_reply:
      "To College Scholarship Section,\n\nI received an SMS claiming my scholarship would be cancelled unless Rs. 500 was paid to a personal UPI ID. I have not paid any money. Could you please confirm this is fraudulent and confirm my legitimate scholarship application status?\n\nSincerely,\n[Your Name]\n[Student ID]",
  },

  // 2. EXAM FEE - HINDI - SIMPLE
  "exam_fee_hi_simple": {
    title: "विश्वविद्यालय सेमेस्टर परीक्षा शुल्क एवं हॉल टिकट सूचना",
    summary:
      "इस सूचना में नियमित सेमेस्टर परीक्षा शुल्क, विलंब शुल्क (लेट फीस) की तारीखें और हॉल टिकट डाउनलोड करने के नियम बताए गए हैं।",
    steps: [
      "1. 3 दिसंबर 2025 शाम 5 बजे से पहले नियमित परीक्षा शुल्क ₹1,200 भरें।",
      "2. यदि तारीख छूट जाए, तो ₹100 लेट फीस के साथ 10 दिसंबर तक या ₹500 सुपर लेट फीस के साथ 15 दिसंबर तक भरें।",
      "3. केवल कॉलेज पोर्टल पर SBI Collect के माध्यम से ही भुगतान करें।",
      "4. किसी को भी नकद या व्यक्तिगत UPI से पैसे न भेजें।",
      "5. 2 जनवरी 2026 को हॉल टिकट डाउनलोड करने के लिए कम से कम 75% उपस्थिति आवश्यक है।",
    ],
    deadline: "3 दिसंबर 2025 (लेट फीस के साथ अंतिम तिथि: 15 दिसंबर 2025)",
    documents_needed: [
      "कॉलेज स्टूडेंट पोर्टल लॉगिन आईडी व पासवर्ड",
      "SBI Collect फीस रसीद",
      "लाइब्रेरी नो-ड्यूज पर्ची",
    ],
    risks_if_ignored:
      "यदि आप 15 दिसंबर तक परीक्षा शुल्क नहीं भरते हैं, तो आपको परीक्षा में बैठने की अनुमति नहीं मिलेगी और हॉल टिकट जारी नहीं होगा।",
    trust_check: {
      verdict: "genuine",
      reason:
        "यह विश्वविद्यालय परीक्षा नियंत्रक की आधिकारिक अधिसूचना है जिसमें केवल आधिकारिक कॉलेज पोर्टल से भुगतान करने का निर्देश है।",
      tip: "कॉलेज फीस कभी भी किसी अनजान व्यक्ति के निजी मोबाइल नंबर या गूगल पे पर न भेजें।",
    },
    glossary: [
      {
        term: "सप्लीमेंट्री परीक्षा",
        meaning: "जिन विषयों में छात्र पहले अनुत्तीर्ण हो गए थे, उन्हें दोबारा पास करने के लिए दी जाने वाली परीक्षा।",
      },
      {
        term: "SBI Collect",
        meaning: "भारतीय स्टेट बैंक का आधिकारिक ऑनलाइन पोर्टल जिससे सरकारी कॉलेज फीस जमा करते हैं।",
      },
    ],
    quiz: [
      {
        question: "परीक्षा फीस का भुगतान कैसे करना है?",
        options: ["कॉलेज ERP पोर्टल पर SBI Collect से", "किसी शिक्षक के निजी नंबर पर UPI से", "कैश में किसी दुकान पर"],
        answer_index: 0,
        simpler_explanation:
          "कॉलेज केवल आधिकारिक पोर्टल से भुगतान स्वीकार करता है। किसी भी व्यक्तिगत नंबर पर पैसे न भेजें।",
      },
    ],
    draft_reply:
      "आदरणीय परीक्षा नियंत्रक महोदय,\n\nमैंने कॉलेज पोर्टल पर SBI Collect के माध्यम से ₹1,200 परीक्षा शुल्क का भुगतान कर दिया है। मेरा ट्रांजेक्शन नंबर संलग्न है। कृपया हॉल टिकट जारी करने हेतु रिकॉर्ड अपडेट करें।\n\nधन्यवाद,\n[आपका नाम]\n[रोल नंबर]",
  },

  // 2. EXAM FEE - TELUGU - SIMPLE
  "exam_fee_te_simple": {
    title: "యూనివర్సిటీ సెమిస్టర్ పరీక్ష ఫీజు మరియు హాల్ టికెట్ నోటీసు",
    summary:
      "ఈ సర్క్యులర్ డిగ్రీ మరియు పీజీ విద్యార్థులకు రెగ్యులర్ సెమిస్టర్ పరీక్ష ఫీజు, లేట్ ఫీజు గడువులు మరియు హాల్ టికెట్ నిబంధనలను తెలియజేస్తుంది.",
    steps: [
      "1. డిసెంబర్ 3, 2025 సాయంత్రం 5 గంటలలోపు సాధారణ పరీక్ష ఫీజు రూ. 1,200 చెల్లించండి.",
      "2. ఆలస్యమైతే రూ. 100 జరిమానాతో డిసెంబర్ 10 వరకు, రూ. 500 జరిమానాతో డిసెంబర్ 15 వరకు చెల్లించవచ్చు.",
      "3. కాలేజీ అధికారిక ERP పోర్టల్‌లో SBI Collect ద్వారా మాత్రమే ఫీజు చెల్లించాలి.",
      "4. నగదు లేదా ప్రైవేట్ UPI ద్వారా ఎవరికీ చెల్లించకూడదు.",
      "5. జనవరి 2, 2026న హాల్ టికెట్ పొందడానికి కనీసం 75% హాజరు ఉండాలి.",
    ],
    deadline: "డిసెంబర్ 3, 2025 (లేట్ ఫీజుతో చివరి తేదీ: డిసెంబర్ 15, 2025)",
    documents_needed: [
      "కాలేజీ స్టూడెంట్ పోర్టల్ లాగిన్ వివరాలు",
      "SBI Collect పరీక్ష ఫీజు చెల్లింపు రసీదు",
      "లైబ్రరీ నో-డ్యూస్ రసీదు",
    ],
    risks_if_ignored:
      "డిసెంబర్ 15 లోపు పరీక్ష ఫీజు చెల్లించకపోతే సెమిస్టర్ పరీక్షలు రాయడానికి అనుమతి లభించదు, హాల్ టికెట్ రాదు.",
    trust_check: {
      verdict: "genuine",
      reason:
        "యూనివర్సిటీ పరీక్ష నియంత్రణ అధికారి అధికారిక నోటీసు. కేవలం కాలేజీ SBI Collect ద్వారా మాత్రమే ఫీజు కట్టాలని స్పష్టంగా సూచించారు.",
      tip: "కాలేజీ ఫీజులను ఎప్పుడూ ఏ ప్రైవేట్ వ్యక్తికి లేదా గుర్తుతెలియని లింకులలో చెల్లించకండి.",
    },
    glossary: [
      {
        term: "సప్లిమెంటరీ పరీక్ష",
        meaning: "క్రితం సెమిస్టర్లలో ఫెయిల్ అయిన సబ్జెక్టులను మళ్ళీ రాసి పాస్ కావడానికి నిర్వహించే పరీక్ష.",
      },
    ],
    quiz: [
      {
        question: "పరీక్ష ఫీజును ఎలా చెల్లించాలి?",
        options: ["కాలేజీ ERP లో SBI Collect ద్వారా", "ప్రొఫెసర్ గారి వ్యక్తిగత PhonePe నంబరుకు", "బయట జిరాక్స్ షాపులో నగదుగా"],
        answer_index: 0,
        simpler_explanation:
          "యూనివర్సిటీ ఎల్లప్పుడూ అధికారిక కాలేజీ పోర్టల్ ద్వారా మాత్రమే ఫీజు తీసుకుంటుంది.",
      },
    ],
    draft_reply:
      "గౌరవనీయులైన కంట్రోలర్ ఆఫ్ ఎగ్జామినేషన్స్ గారికి,\n\nనేను నా సెమిస్టర్ పరీక్ష ఫీజు రూ. 1,200 ను SBI Collect ద్వారా విజయవంతంగా చెల్లించాను. నా ట్రాన్సాక్షన్ రసీదు జత చేశాను. దయచేసి పరిశీలించగలరు.\n\nభవదీయుడు,\n[మీ పేరు]\n[రోల్ నంబర్]",
  },

  // 2. EXAM FEE - TAMIL - SIMPLE
  "exam_fee_ta_simple": {
    title: "பல்கலைக்கழக செமஸ்டர் தேர்வு கட்டணம் மற்றும் ஹால் டிக்கெட் அறிவிப்பு",
    summary:
      "இந்த சுற்றறிக்கை செமஸ்டர் தேர்வு கட்டணம், அபராத கட்டண தேதிகள் மற்றும் ஹால் டிக்கெட் பெறுவதற்கான நிபந்தனைகளை விளக்குகிறது.",
    steps: [
      "1. டிசம்பர் 3, 2025 மாலை 5 மணிக்குள் வழக்கமான கட்டணம் ரூ. 1,200 செலுத்தவும்.",
      "2. தவறினால் ரூ. 100 அபராதத்துடன் டிசம்பர் 10 வரையிலும், ரூ. 500 அபராதத்துடன் டிசம்பர் 15 வரையிலும் செலுத்தலாம்.",
      "3. கல்லூரி ERP போர்ட்டலில் SBI Collect வழியாக மட்டுமே கட்டணம் செலுத்த வேண்டும்.",
      "4. பணமாகவோ அல்லது தனிநபர் UPI மூலமாகவோ செலுத்தக் கூடாது.",
      "5. ஜனவரி 2, 2026 அன்று ஹால் டிக்கெட் பெற 75% வருகைப்பதிவு அவசியம்.",
    ],
    deadline: "டிசம்பர் 3, 2025 (அபராதத்துடன் இறுதி நாள்: டிசம்பர் 15, 2025)",
    documents_needed: [
      "கல்லூரி ERP உள்நுழைவு விவரங்கள்",
      "SBI Collect கட்டண ரசீது",
      "நூலக நிலுவை இல்லா சான்று",
    ],
    risks_if_ignored:
      "டிசம்பர் 15க்குள் கட்டணம் செலுத்தவில்லை என்றால் தேர்வெழுத முடியாது, ஹால் டிக்கெட் கிடைக்காது.",
    trust_check: {
      verdict: "genuine",
      reason: "பல்கலைக்கழக தேர்வு கட்டுப்பாட்டு அதிகாரியின் அதிகாரப்பூர்வ சுற்றறிக்கை.",
      tip: "கல்லூரி கட்டணங்களை எந்த ஒரு தனிநபர் தொலைபேசி எண்ணுக்கும் அனுப்பாதீர்கள்.",
    },
    glossary: [
      {
        term: "சப்ளிமெண்டரி தேர்வு",
        meaning: "முந்தைய பருவங்களில் தேர்ச்சி பெறாத தாள்களை மீண்டும் எழுதி தேர்ச்சி பெறுவதற்கான தேர்வு.",
      },
    ],
    quiz: [
      {
        question: "தேர்வு கட்டணத்தை எவ்வாறு செலுத்த வேண்டும்?",
        options: ["கல்லூரி போர்ட்டலில் SBI Collect மூலம்", "பேராசிரியரின் தனிப்பட்ட UPI எண்ணுக்கு", "வெளி கடையில் ரொக்கமாக"],
        answer_index: 0,
        simpler_explanation:
          "கல்லூரி இணையதளத்தில் உள்ள அதிகாரப்பூர்வ வங்கி போர்ட்டலில் மட்டுமே பணம் செலுத்த வேண்டும்.",
      },
    ],
    draft_reply:
      "மதிப்பிற்குரிய தேர்வு கட்டுப்பாட்டு அதிகாரி அவர்களுக்கு,\n\nநான் எனது செமஸ்டர் தேர்வு கட்டணம் ரூ. 1,200 ஐ செலுத்திவிட்டேன். கட்டண ரசீதை இணைத்துள்ளேன்.\n\nநன்றி,\n[உங்கள் பெயர்]\n[பதிவு எண்]",
  },

  // 3. SCAM ALERT - HINDI - SIMPLE
  "scam_alert_hi_simple": {
    title: "सावधान: छात्रवृत्ति रद्द करने का फर्जी व धोखाधड़ी संदेश",
    summary:
      "यह एक फर्जी और संदिग्ध संदेश है जिसमें छात्रवृत्ति रद्द करने की धमकी देकर तुरंत ₹500 निजी UPI या फर्जी लिंक पर भेजने को कहा गया है।",
    steps: [
      "1. दिए गए लिंक पर बिल्कुल क्लिक न करें और किसी भी नंबर पर ₹500 न भेजें।",
      "2. घबराएं नहीं: कोई भी सरकारी विभाग 2 घंटे में स्कॉलरशिप रद्द नहीं करता।",
      "3. तुरंत अपने कॉलेज के स्कॉलरशिप विभाग या प्रशासनिक कार्यालय में जाकर इस संदेश की पुष्टि करें।",
      "4. इस धोखाधड़ी की शिकायत राष्ट्रीय साइबर अपराध हेल्पलाइन नंबर 1930 पर करें या cybercrime.gov.in पर दर्ज करें।",
    ],
    deadline: "कोई असली अंतिम तारीख नहीं (संदेश में 2 घंटे का समय डराने के लिए दिया गया है)",
    documents_needed: [
      "फर्जी मैसेज का स्क्रीनशॉट",
      "अपने असली कॉलेज स्कॉलरशिप फॉर्म की रसीद",
    ],
    risks_if_ignored:
      "यदि आप ₹500 भेजेंगे, तो जालसाज आपके पैसे चुरा लेंगे और आपके बैंक खाते से और पैसे निकालने की कोशिश कर सकते हैं।",
    trust_check: {
      verdict: "scam",
      reason:
        "गंभीर खतरे: 2 घंटे में रद्द करने की धमकी, निजी UPI आईडी (9876543210@paytm) पर पैसे मांगना, और फर्जी वेबसाइट लिंक।",
      tip: "सरकारी स्कॉलरशिप सत्यापन पूरी तरह मुफ्त होता है। तुरंत 1930 पर साइबर फ्रॉड की सूचना दें।",
    },
    glossary: [
      {
        term: "साइबर फ्रॉड / फिशिंग",
        meaning: "एक धोखा जिसमें अपराधी सरकारी अधिकारी बनकर लोगों को डराते हैं और पैसे ठगते हैं।",
      },
    ],
    quiz: [
      {
        question: "ऐसे धमकी भरे मैसेज आने पर क्या करना चाहिए?",
        options: [
          "पैसे बिल्कुल न दें, कॉलेज ऑफिस और 1930 पर शिकायत करें",
          "तुरंत ₹500 भेज दें",
          "अपना बैंक पासवर्ड और ओटीपी भेज दें",
        ],
        answer_index: 0,
        simpler_explanation:
          "जालसाज डराकर पैसे ऐंठते हैं। सरकार कभी भी निजी UPI पर पैसे नहीं मांगती।",
      },
    ],
    draft_reply:
      "कॉलेज स्कॉलरशिप विभाग,\n\nमुझे एक संदिग्ध संदेश मिला है जिसमें स्कॉलरशिप रद्द होने का डर दिखाकर ₹500 मांगे गए हैं। मैंने कोई पैसा नहीं भेजा है। कृपया पुष्टि करें कि मेरा स्कॉलरशिप आवेदन सुरक्षित है।\n\nसादर,\n[आपका नाम]\n[छात्र आईडी]",
  },

  // 3. SCAM ALERT - TELUGU - SIMPLE
  "scam_alert_te_simple": {
    title: "హెచ్చరిక: స్కాలర్‌షిప్ రద్దు పేరుతో నకిలీ మోసపూరిత సందేశం",
    summary:
      "ఇది అత్యంత ప్రమాదకరమైన సైబర్ మోసం. 2 గంటల్లో స్కాలర్‌షిప్ రద్దవుతుందని బెదిరిస్తూ ప్రైవేట్ UPI కి రూ. 500 చెల్లించమని పంపిన నకిలీ మెసేజ్.",
    steps: [
      "1. లింక్‌ను ఎట్టి పరిస్థితుల్లోనూ క్లిక్ చేయవద్దు మరియు రూ. 500 పంపవద్దు.",
      "2. కంగారు పడవద్దు: ఏ ప్రభుత్వ శాఖ లేదా కాలేజీ కూడా 2 గంటల వ్యవధిలో స్కాలర్‌షిప్‌లను రద్దు చేయదు.",
      "3. వెంటనే మీ కాలేజీ ఆఫీస్‌కు వెళ్లి ఈ సందేశాన్ని చూపించి మీ స్కాలర్‌షిప్ స్థితిని తెలుసుకోండి.",
      "4. ఈ మోసంపై వెంటనే జాతీయ సైబర్ హెల్ప్‌లైన్ 1930 కు కాల్ చేసి లేదా cybercrime.gov.in లో ఫిర్యాదు చేయండి.",
    ],
    deadline: "చట్టబద్ధమైన గడువు ఏమీ లేదు (2 గంటల గడువు మిమ్మల్ని భయపెట్టడానికి సృష్టించినది)",
    documents_needed: [
      "ఈ అనుమానాస్పద సందేశం యొక్క స్క్రీన్‌షాట్",
      "మీ అసలైన కాలేజీ స్కాలర్‌షిప్ దరఖాస్తు రసీదు",
    ],
    risks_if_ignored:
      "మీరు రూ. 500 చెల్లిస్తే ఆ డబ్బు మోసగాళ్ల చేతికి వెళుతుంది మరియు మీ ఖాతా నుండి మరింత సొమ్ము కాజేసే ప్రమాదం ఉంది.",
    trust_check: {
      verdict: "scam",
      reason:
        "తీవ్రమైన మోసపూరిత గుర్తులు: అర్జెంట్ బెదిరింపులు, వ్యక్తిగత UPI ID (9876543210@paytm) కి డబ్బు డిమాండ్, మరియు అనధికారిక వెబ్‌సైట్ లింక్.",
      tip: "ప్రభుత్వ స్కాలర్‌షిప్ ధృవీకరణ పూర్తిగా ఉచితం. వెంటనే సైబర్ హెల్ప్‌లైన్ 1930 కి సమాచారం ఇవ్వండి.",
    },
    glossary: [
      {
        term: "సైబర్ మోసం (Cyber Scam)",
        meaning: "అధికారుల పేరుతో నకిలీ సందేశాలు పంపి ప్రజలను భయపెట్టి డబ్బులు దోచుకోవడం.",
      },
    ],
    quiz: [
      {
        question: "స్కాలర్‌షిప్ రద్దు అవుతుందని రూ. 500 అడిగితే ఏమి చేయాలి?",
        options: [
          "డబ్బు చెల్లించకూడదు; కాలేజీకి మరియు 1930 హెల్ప్‌లైన్‌కు తెలపాలి",
          "భయపడి వెంటనే రూ. 500 కట్టేయాలి",
          "బ్యాంక్ పాస్‌వర్డ్ మరియు ఓటీపీ పంపాలి",
        ],
        answer_index: 0,
        simpler_explanation:
          "ప్రభుత్వం ఎప్పుడూ ఫోన్ నంబర్లకు డబ్బులు అడగదు. ఇటువంటి మెసేజ్‌లను నమ్మకూడదు.",
      },
    ],
    draft_reply:
      "కాలేజీ స్కాలర్‌షిప్ సెక్షన్ గారికి,\n\nనాకు ఒక అనుమానాస్పద మెసేజ్ వచ్చింది. అందులో రూ. 500 కట్టకపోతే స్కాలర్‌షిప్ రద్దవుతుందని ఉంది. నేను ఎలాంటి డబ్బు కట్టలేదు. దయచేసి ఇది మోసపూరితమైనదని నిర్ధారించి నా నిజమైన స్కాలర్‌షిప్ స్థితిని తెలపగలరు.\n\nఇట్లు,\n[మీ పేరు]\n[విద్యార్థి గుర్తింపు సంఖ్య]",
  },

  // 3. SCAM ALERT - TAMIL - SIMPLE
  "scam_alert_ta_simple": {
    title: "எச்சரிக்கை: உதவித்தொகை ரத்து என்ற பெயரில் போலி மோசடி செய்தி",
    summary:
      "இது ஒரு ஆபத்தான போலி செய்தி. உதவித்தொகை ரத்து செய்யப்படும் என மிரட்டி உடனடியாக தனிநபர் UPI க்கு ரூ. 500 அனுப்பக் கோருகிறது.",
    steps: [
      "1. இணைப்பை கிளிக் செய்யாதீர்கள் மற்றும் எவருக்கும் ரூ. 500 அனுப்பாதீர்கள்.",
      "2. பயப்பட வேண்டாம்: எந்த அரசு அலுவலகமும் 2 மணி நேரத்தில் உதவித்தொகையை ரத்து செய்யாது.",
      "3. உங்கள் கல்லூரி அலுவலகத்திற்குச் சென்று இந்த செய்தியை காட்டி உண்மை நிலையை அறியவும்.",
      "4. இந்த மோசடி குறித்து தேசிய சைபர் கிரைம் உதவி எண் 1930 அல்லது cybercrime.gov.in இல் புகார் செய்யவும்.",
    ],
    deadline: "உண்மையான காலக்கெடு எதுவும் இல்லை (பயமுறுத்தவே 2 மணி நேரம் என்று கூறியுள்ளனர்)",
    documents_needed: [
      "போலி செய்தியின் திரைக்காட்சி (Screenshot)",
      "உங்கள் உண்மையான கல்லூரி உதவித்தொகை ஒப்புகைச் சீட்டு",
    ],
    risks_if_ignored:
      "ரூ. 500 செலுத்தினால் உங்கள் பணம் பறிபோகும் மற்றும் வங்கி கணக்கிலிருந்து கூடுதல் பணம் திருடப்படலாம்.",
    trust_check: {
      verdict: "scam",
      reason:
        "கடுமையான மோசடி அறிகுறிகள்: 2 மணி நேர மிரட்டல், தனிநபர் UPI ஐடி (9876543210@paytm) மற்றும் போலி இணையதள இணைப்பு.",
      tip: "அரசு உதவித்தொகை சரிபார்ப்பு முற்றிலும் இலவசம். உடனடியாக 1930 என்ற எண்ணிற்கு தகவல் தெரிவிக்கவும்.",
    },
    glossary: [
      {
        term: "சைபர் மோசடி (Phishing)",
        meaning: "அதிகாரிகள் போல நடித்து போலி செய்திகள் அனுப்பி பணம் பறிக்கும் குற்றச் செயல்.",
      },
    ],
    quiz: [
      {
        question: "ரூ. 500 கட்டக் கோரி மிரட்டல் செய்தி வந்தால் என்ன செய்ய வேண்டும்?",
        options: [
          "பணம் செலுத்தக் கூடாது; கல்லூரிக்கும் 1930 எண்ணிற்கும் தகவல் தெரிவிக்க வேண்டும்",
          "உடனடியாக ரூ. 500 அனுப்ப வேண்டும்",
          "வங்கி கடவுச்சொல்லை அனுப்ப வேண்டும்",
        ],
        answer_index: 0,
        simpler_explanation:
          "அரசு ஒருபோதும் தனிநபர் எண்களுக்கு பணம் கேட்காது. இதுபோன்ற செய்திகளை நம்ப வேண்டாம்.",
      },
    ],
    draft_reply:
      "கல்லூரி உதவித்தொகை பிரிவிற்கு,\n\nஎனக்கு ரூ. 500 கட்டாவிட்டால் உதவித்தொகை ரத்து செய்யப்படும் என மிரட்டல் செய்தி வந்துள்ளது. நான் பணம் எதுவும் செலுத்தவில்லை. எனது விண்ணப்ப நிலையை உறுதி செய்யுமாறு கேட்டுக்கொள்கிறேன்.\n\nஇப்படிக்கு,\n[உங்கள் பெயர்]\n[மாணவர் எண்]",
  },
};

/**
 * Returns a cached result for a sample document in the requested language and level,
 * falling back gracefully to English simple if a specific locale variant is not mapped.
 */
export function getCachedSampleResult(
  sampleId: "scholarship" | "exam_fee" | "scam_alert",
  language: SupportedLanguage,
  level: ReadingLevel
): AnalyzeResult {
  const directKey = `${sampleId}_${language}_${level}`;
  if (PRECOMPUTED_SAMPLE_RESULTS[directKey]) {
    return PRECOMPUTED_SAMPLE_RESULTS[directKey];
  }

  const langKey = `${sampleId}_${language}_simple`;
  if (PRECOMPUTED_SAMPLE_RESULTS[langKey]) {
    return PRECOMPUTED_SAMPLE_RESULTS[langKey];
  }

  // Fallback to English simple
  return PRECOMPUTED_SAMPLE_RESULTS[`${sampleId}_en_simple`];
}
