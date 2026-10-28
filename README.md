# OfferProof 🛡️🇮🇳

> **"Verify before you accept."**
> An India-focused internship offer verification assistant designed to protect students from recruitment fraud, lookalike domains, and upfront fee extortion.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![National Helpline](https://img.shields.io/badge/Cybercrime%20Helpline-1930-red.svg)](https://cybercrime.gov.in)

---

## 📌 Problem Context in India
Every hiring season, thousands of Indian college students fall victim to predatory internship scams:
- **Upfront Fee Demands**: Recruiters demanding ₹1,000–₹10,000 disguised as "laptop courier security deposits", "document verification charges", "training kit fees", or "registration fees".
- **Telegram & WhatsApp Task Scams**: Unsolicited job offers offering ₹30,000/month for "YouTube likes", "hotel reviews", or "data entry/typing" leading to prepaid financial traps.
- **Brand Impersonation**: Scammers claiming to represent prominent Indian enterprises (TCS, Infosys, Swiggy, Razorpay) while communicating from free Gmail or lookalike domains (`tcs-careers-india.com`).
- **Coercive Threats**: Fabricated legal notices claiming "breach of contract under IPC" to extort money from vulnerable freshers.

**OfferProof** provides students and college Placement Cells (TPOs) with an instant, explainable, and privacy-preserving verification report before accepting an offer or making any payment.

---

## 🚀 Key Features

1. **Deterministic Verification Engine (`lib/engine/`)**:
   - Executes real, rule-based heuristics on the server through Next.js serverless API routes (`/api/verify`).
   - Reusable modules completely separated from UI rendering components.
   - **No fabricated numeric fraud probabilities** (e.g. no fake "87.3% scam" numbers).
   - Distinguishes **observed facts**, **rule-based warnings**, and **details that have not been verified**.

2. **Official Listing Match System (`lib/engine/listingComparator.ts`)**:
   - Compares submitted offer terms against the corresponding public listing on the company's official careers site or an authorized ATS (Greenhouse, Lever, Workday, Internshala, Unstop).
   - **SSRF Protection (`urlValidator.ts`)**: Server-side URL fetching blocks private IP ranges (`10.x`, `172.16.x`, `192.168.x`, `127.0.0.1`), cloud metadata (`169.254.169.254`), non-standard ports, and internal hostnames.
   - **Domain Source Validation (`sourceValidator.ts`)**: Distinguishes verified official corporate portals, authorized enterprise ATS platforms, unverified user-provided domains, and lookalike domains.
   - **10-Field Discrepancy Matrix**:
     1. Company Name
     2. Job / Internship Title
     3. Job / Requisition ID
     4. Location & Work Arrangement (Remote / Hybrid / On-site)
     5. Salary or Stipend
     6. Employment / Internship Duration
     7. Application Deadline
     8. Recruiter Name & Contact Details
     9. Application Channel & URL
     10. Fees, Deposits & Monetary Requirements (Security Critical)
   - **Three-Pillar Independent Verification Framework**:
     1. *Does the company appear legitimate?*
     2. *Does the submitted opportunity match an official or authorized listing?*
     3. *Has the recruiter's authority and specific offer been independently confirmed?*
     *(A matching listing does NOT automatically prove the recruiter is genuine; scammers routinely copy real job descriptions!).*

3. **6 Specialized Verification Rules**:
   - **Fee Rule (`feeRule.ts`)**: Flags registration fees, processing charges, laptop deposits, and UPI/QR code payment requests under AICTE internship norms. Smartly distinguishes legitimate corporate anti-fee policy disclaimers.
   - **Domain & Email Rule (`domainRule.ts`)**: Compares recruiter email domain against claimed corporate website domain. Flags free public webmail (`@gmail.com`, `@outlook.com`), lookalike typo-squatting domains (`-careers`, `-india`), and verifies ATS portals (Greenhouse, Lever, Internshala).
   - **Communication Channel Rule (`sourceRule.ts`)**: Evaluates the risk profile of Telegram, WhatsApp, Instagram ads, cold emails, vs. official Campus Placement Cell (TPO) drives.
   - **Offer Clauses & Tactical Language (`textAnalysisRule.ts`)**: Scans offer text for artificial pressure countdowns ("pay within 4 hours"), typing scam signatures, unrealistic stipends, and bogus legal threats.
   - **Evidence Completeness (`evidenceRule.ts`)**: Identifies missing verification anchors (missing job listing, unverified recruiter identity, prominent brand name claimed without domain authorization).
   - **Domain Utilities (`domainUtils.ts`)**: Multi-level domain apex extraction, compound TLD resolution (`.co.in`, `.gov.in`), and lookalike keyword analysis.

3. **In-Browser Document Handling & Privacy**:
   - Supports **PDF**, **PNG**, and **JPG** (up to 5MB).
   - **Client-side PDF text extraction** using `pdfjs-dist` in-memory.
   - Clear **OCR-unavailable fallback** for image files with instructions to paste text manually.
   - **Zero file storage**: Documents are parsed in browser memory and never uploaded to servers, databases, or third-party AI services.
   - Never executes uploaded files or opens embedded links automatically.

4. **Judge-Ready Sample Cases**:
   - **Suspicious Case**: Recruiter demands ₹2,500 UPI registration fee within 4 hours, free Gmail, Telegram recruitment.
   - **Lower Risk Case**: Razorpay campus drive, `@razorpay.com` domain, official careers listing link, ₹0 fee.
   - **Inconclusive Case**: Swiggy brand name claimed, Telegram outreach, unverified personal Outlook email, no career listing link.
   - *All sample cases run through the exact same `/api/verify` serverless route as user-submitted data.*

5. **Student Safety & Action Plan**:
   - Copyable notification template for college Training & Placement Officers (TPO).
   - Direct emergency links to the **National Cyber Crime Reporting Portal (`cybercrime.gov.in`)** and toll-free helpline **1930**.
   - Direct link to the **Ministry of Corporate Affairs (MCA)** Master Company Record search.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.6 (Strict Type Safety)
- **Styling**: Tailwind CSS 3.4 (Accessible navy, teal, amber, red palette)
- **Icons**: Lucide React
- **Document Parsing**: Client-side `pdfjs-dist` in-memory parser
- **Deployment**: Vercel-compatible Serverless Architecture

---

## 📁 Architecture & File Structure

```
offerproof/
├── app/
│   ├── api/
│   │   └── verify/
│   │       └── route.ts             # Vercel-compatible serverless verification endpoint
│   ├── globals.css                  # Custom Tailwind & print styles
│   ├── layout.tsx                   # Root layout, metadata & viewport
│   └── page.tsx                     # Landing hero, sample cases, form & report views
├── components/
│   ├── Header.tsx                   # Brand header with helpline 1930 banner
│   ├── Hero.tsx                     # Student-focused hero section
│   ├── SampleCases.tsx              # 3 judge-ready demo scenarios with 1-click test
│   ├── VerificationForm.tsx         # Comprehensive input form with validation & samples
│   ├── DocumentUpload.tsx           # In-browser PDF extractor & image OCR fallback
│   ├── ResultsReport.tsx            # Full verification report with filters & print
│   ├── FindingCard.tsx              # Individual finding card with severity, evidence & action
│   ├── LimitationsSection.tsx       # Unverified aspects and methodological limitations
│   ├── ActionChecklist.tsx          # Step-by-step student next steps & TPO templates
│   ├── IndiaScamGuideModal.tsx      # Comprehensive educational guide on Indian internship scams
│   └── Footer.tsx                   # AICTE notices, disclaimer & cyber helplines
├── lib/
│   ├── types.ts                     # TypeScript interfaces (OfferInput, Finding, VerificationReport)
│   ├── sampleCases.ts               # Predefined benchmark test scenarios
│   ├── client/
│   │   └── pdfExtractor.ts          # Safe browser-based PDF text parser
│   └── engine/
│       ├── index.ts                 # Engine orchestrator & overall assessment logic
│       ├── feeRule.ts               # Fee extortion & UPI/QR detection rule
│       ├── domainRule.ts            # Recruiter email domain vs company website rule
│       ├── sourceRule.ts            # Telegram, WhatsApp, Campus Placement source rule
│       ├── textAnalysisRule.ts      # Pressure tactics, unrealistic roles & threats rule
│       ├── evidenceRule.ts          # Evidence completeness & brand impersonation rule
│       └── domainUtils.ts           # Domain parsing, compound TLDs & lookalike patterns
├── scripts/
│   └── probe-api.mjs                # Automated end-to-end HTTP test probe
├── next.config.mjs                  # Webpack aliases & serverless configuration
├── tailwind.config.ts               # Custom brand palette (Navy, Teal, Amber, Red)
├── tsconfig.json                    # Strict TypeScript configuration
└── .env.example                     # Optional future environment configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js v24 LTS)
- npm 9+

### 1. Clone & Install
```bash
git clone <repository-url>
cd offerproof
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Type Check
```bash
npm run build
```
This compiles static pages, verifies all TypeScript types, and creates production serverless assets with zero build warnings.

### 4. Run Automated End-to-End Tests
To test the Next.js API route against all three judge sample cases:
```bash
npm start -p 3000   # In one terminal
npm test            # In another terminal (runs scripts/probe-api.mjs)
```

---

## 🧪 Testing the 3 Sample Cases in the UI

1. Open the homepage at `http://localhost:3000`.
2. Scroll to the **"Test Predefined Verification Cases"** section.
3. Click **"Analyze This Case"** on any of the 3 cards:
   - **Case 1 (Suspicious)**: Immediately flags ₹2,500 registration fee, UPI payment channel, Gmail address for enterprise, and Telegram recruitment (`HIGH_WARNING`).
   - **Case 2 (Lower Risk)**: Validates matching `@razorpay.com` domain, verifiable career portal link, campus placement vetting, and explicit anti-fee policy (`LOWER_RISK`).
   - **Case 3 (Inconclusive)**: Detects legitimate brand name claimed (Swiggy) with unverified personal `@outlook.com` email and missing career listing link (`INCONCLUSIVE`).

---

## ☁️ Deployment Guidance (Vercel)

OfferProof is built specifically for zero-configuration deployment on **Vercel**:
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Framework Preset: **Next.js**.
4. Root Directory: `./`.
5. No build command changes needed (`npm run build` works out of the box).
6. No mandatory environment variables are required for the base deterministic verification engine.

---

## ⚖️ Legal & Ethical Disclaimers
OfferProof uses deterministic heuristics based on public advisories from the **All India Council for Technical Education (AICTE)**, the **Ministry of Corporate Affairs (MCA)**, and the **Ministry of Home Affairs (MHA)**. 
- A "Lower Risk" finding does not guarantee that an offer is 100% genuine; threat actors may occasionally clone genuine email headers.
- An "Inconclusive" finding means the digital evidence submitted was insufficient to confirm recruiter identity; it is not a declaration of guilt.
- Always cross-verify directly with your college Training & Placement Officer (TPO) and official corporate switchboards.

---

## 📞 Emergency Assistance
If you have transferred funds to a fraudulent recruiter:
- **National Cyber Crime Helpline**: Dial **1930** immediately.
- **Reporting Portal**: File an incident report at [cybercrime.gov.in](https://cybercrime.gov.in).
