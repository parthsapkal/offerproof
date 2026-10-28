import { DemoListingScenario, FieldComparison, OfficialListingMatchResult } from './types';

export interface ParsedListingData {
  companyName?: string;
  jobTitle?: string;
  jobId?: string;
  location?: string;
  compensation?: string;
  duration?: string;
  applicationDeadline?: string;
  recruiterContact?: string;
  applicationChannel?: string;
  paymentRequirement?: string;
  isAvailable: boolean;
  httpStatus?: number;
  errorMessage?: string;
}

export const DEMO_SCENARIOS: Record<string, {
  title: string;
  badgeLabel: string;
  description: string;
  expectedStatus: string;
  listingUrl: string;
  companyWebsite: string;
  companyName: string;
  jobTitle: string;
  jobId: string;
  location: string;
  compensation: string;
  duration: string;
  applicationDeadline: string;
  recruiterName: string;
  recruiterEmail: string;
  offerSource: string;
  feeRequested: boolean;
  feeAmount: number | null;
  feeReason: string;
  pastedText: string;
  simulatedListing: ParsedListingData;
}> = {
  matching_role: {
    title: 'Scenario 1: Matching Role, Compensation & Job ID (Strong Match)',
    badgeLabel: 'Demo 1: Strong Match',
    description:
      'The submitted offer letter aligns accurately with the official job opening on the company careers portal across role, compensation, and requisition ID.',
    expectedStatus: 'STRONG_MATCH',
    companyName: 'Razorpay Software Private Limited',
    companyWebsite: 'https://razorpay.com',
    listingUrl: 'https://razorpay.com/careers/jobs/frontend-intern-2025',
    jobTitle: 'Software Engineering Intern (Frontend)',
    jobId: 'RZP-ENG-2025-042',
    location: 'Bangalore, Karnataka (Hybrid)',
    compensation: '\u20B935,000 / month',
    duration: '6 Months',
    applicationDeadline: '15 November 2025',
    recruiterName: 'Priya Nair (University Talent Acquisition)',
    recruiterEmail: 'priya.nair@razorpay.com',
    offerSource: 'campus',
    feeRequested: false,
    feeAmount: 0,
    feeReason: '',
    pastedText: `Offer Letter Reference: RZP-ENG-2025-042
Position: Software Engineering Intern (Frontend)
Stipend: \u20B935,000 per month
Location: Bangalore, Karnataka (Hybrid)
Duration: 6 Months
Contact: priya.nair@razorpay.com
Integrity Clause: Razorpay does not charge any registration or equipment deposit fee.`,
    simulatedListing: {
      isAvailable: true,
      httpStatus: 200,
      companyName: 'Razorpay Software Private Limited',
      jobTitle: 'Software Engineering Intern (Frontend)',
      jobId: 'RZP-ENG-2025-042',
      location: 'Bangalore, Karnataka (Hybrid)',
      compensation: '\u20B935,000 / month',
      duration: '6 Months',
      applicationDeadline: '15 November 2025',
      recruiterContact: 'priya.nair@razorpay.com / university-talent@razorpay.com',
      applicationChannel: 'Official Portal: https://razorpay.com/careers',
      paymentRequirement: 'Strictly \u20B90 (No application or processing fees permitted)',
    },
  },

  copied_with_fee: {
    title: 'Scenario 2: Copied Genuine Listing with Added Upfront Fee (Payment Mismatch)',
    badgeLabel: 'Demo 2: Copied Listing + Fee Scam',
    description:
      'A scammer copied a real job description from Thoughtworks verbatim, but added a \u20B92,500 "registration & laptop courier fee" to the offer letter.',
    expectedStatus: 'MISMATCH_DETECTED',
    companyName: 'Thoughtworks Technologies India',
    companyWebsite: 'https://www.thoughtworks.com',
    listingUrl: 'https://www.thoughtworks.com/careers/jobs/grad-dev-9102',
    jobTitle: 'Graduate Developer Intern',
    jobId: 'TW-IN-GRAD-9102',
    location: 'Pune / Bangalore (Hybrid)',
    compensation: '\u20B930,000 / month',
    duration: '6 Months',
    applicationDeadline: '30 November 2025',
    recruiterName: 'Anil HR (Staffing Associate)',
    recruiterEmail: 'anil.thoughtworks.recruitment@gmail.com',
    offerSource: 'telegram',
    feeRequested: true,
    feeAmount: 2500,
    feeReason: 'Mandatory laptop asset insurance and training software kit deposit',
    pastedText: `Congratulations on selection for Graduate Developer Intern (TW-IN-GRAD-9102).
Stipend: \u20B930,000/month.
MANDATORY CLAUSE: To confirm your joining and courier your company workstation, you must transfer a refundable security deposit of \u20B92,500 via UPI within 4 hours.`,
    simulatedListing: {
      isAvailable: true,
      httpStatus: 200,
      companyName: 'Thoughtworks Technologies India',
      jobTitle: 'Graduate Developer Intern',
      jobId: 'TW-IN-GRAD-9102',
      location: 'Pune / Bangalore (Hybrid)',
      compensation: '\u20B930,000 / month',
      duration: '6 Months',
      applicationDeadline: '30 November 2025',
      recruiterContact: 'careers-india@thoughtworks.com',
      applicationChannel: 'Official Portal: thoughtworks.com/careers',
      paymentRequirement: '100% Free of Charge. Thoughtworks never demands any fee, courier deposit, or advance payment from candidates.',
    },
  },

  mismatched_contact: {
    title: 'Scenario 3: Mismatched Recruiter Contact & Channel (Contact Mismatch)',
    badgeLabel: 'Demo 3: Channel Mismatch',
    description:
      'The role details match a public listing, but the recruiter contact details and communication channel differ completely from the official career listing.',
    expectedStatus: 'MISMATCH_DETECTED',
    companyName: 'Swiggy (Bundl Technologies Pvt Ltd)',
    companyWebsite: 'https://www.swiggy.com',
    listingUrl: 'https://careers.swiggy.com/jobs/product-growth-ops-331',
    jobTitle: 'Product Operations & Growth Intern',
    jobId: 'SWIG-OPS-331',
    location: 'Bangalore, Karnataka',
    compensation: '\u20B925,000 / month',
    duration: '3 Months',
    applicationDeadline: '10 November 2025',
    recruiterName: 'Kunal Sharma',
    recruiterEmail: 'kunal.talent.swiggy@outlook.com',
    offerSource: 'telegram',
    feeRequested: false,
    feeAmount: null,
    feeReason: '',
    pastedText: `Hi, I am Kunal from Swiggy Talent Acquisition. We are offering you the Product Operations & Growth Intern role (SWIG-OPS-331).
Stipend: \u20B925,000/month. Please send your documents directly on our Telegram recruitment channel @swiggy_onboarding_team.`,
    simulatedListing: {
      isAvailable: true,
      httpStatus: 200,
      companyName: 'Swiggy (Bundl Technologies Pvt Ltd)',
      jobTitle: 'Product Operations & Growth Intern',
      jobId: 'SWIG-OPS-331',
      location: 'Bangalore, Karnataka',
      compensation: '\u20B925,000 / month',
      duration: '3 Months',
      applicationDeadline: '10 November 2025',
      recruiterContact: 'campus-recruitment@swiggy.in (Authorized Talent Acquisition)',
      applicationChannel: 'Official ATS: https://careers.swiggy.com (Never communicates on Telegram/WhatsApp)',
      paymentRequirement: 'Zero fees. Swiggy does not charge any processing fees.',
    },
  },

  expired_listing: {
    title: 'Scenario 4: Expired or Inaccessible Listing (Unable to Verify)',
    badgeLabel: 'Demo 4: Expired / 404 Listing',
    description:
      'The listing URL points to an authentic company careers domain, but the job opening has expired, been unlisted, or returns a 404 Not Found error.',
    expectedStatus: 'UNABLE_TO_VERIFY',
    companyName: 'Zerodha Broking Limited',
    companyWebsite: 'https://zerodha.com',
    listingUrl: 'https://zerodha.com/careers/jobs/inactive-archive-role-404',
    jobTitle: 'Backend Engineering Intern (Go / Python)',
    jobId: 'ZERO-BE-404',
    location: 'Bangalore, Karnataka (On-site)',
    compensation: '\u20B940,000 / month',
    duration: '6 Months',
    applicationDeadline: 'Expired on 15 Oct 2025',
    recruiterName: 'Campus Recruitment Team',
    recruiterEmail: 'jobs@zerodha.com',
    offerSource: 'cold_email',
    feeRequested: false,
    feeAmount: null,
    feeReason: '',
    pastedText: `Offer Letter for Backend Engineering Intern (Go / Python). Requisition ZERO-BE-404.`,
    simulatedListing: {
      isAvailable: false,
      httpStatus: 404,
      errorMessage: 'HTTP 404: The requested job listing is no longer available or has closed.',
    },
  },

  unverified_domain: {
    title: 'Scenario 5: Listing URL from Unverified / Lookalike Domain (Unverified Source)',
    badgeLabel: 'Demo 5: Unverified Domain',
    description:
      'The user provided a listing URL, but the domain belongs to an unverified third-party blog or suspicious lookalike domain rather than the company\'s official website.',
    expectedStatus: 'USER_PROVIDED_UNVERIFIED',
    companyName: 'Tata Consultancy Services',
    companyWebsite: 'https://www.tcs.com',
    listingUrl: 'https://tcs-careers-portal-india.site/jobs/tcs-national-internship-2025',
    jobTitle: 'Associate Software Trainee Intern',
    jobId: 'TCS-NQT-2025-X',
    location: 'Pan India Remote',
    compensation: '\u20B928,000 / month',
    duration: '6 Months',
    applicationDeadline: '30 October 2025',
    recruiterName: 'TCS Smart Hiring Cell',
    recruiterEmail: 'tcs.recruitment.cell@gmail.com',
    offerSource: 'social_media',
    feeRequested: true,
    feeAmount: 1800,
    feeReason: 'TCS National Qualifier Certification & Verification processing charge',
    pastedText: `Selected for TCS National Internship via portal tcs-careers-portal-india.site. Pay \u20B91,800 verification charge via UPI to confirm your seat.`,
    simulatedListing: {
      isAvailable: true,
      httpStatus: 200,
      companyName: 'TCS Careers Portal India (Third-Party Blog)',
      jobTitle: 'Associate Software Trainee Intern',
      jobId: 'TCS-NQT-2025-X',
      location: 'Pan India Remote',
      compensation: '\u20B928,000 / month',
      duration: '6 Months',
      applicationDeadline: '30 October 2025',
      recruiterContact: 'support@tcs-careers-portal-india.site',
      applicationChannel: 'https://tcs-careers-portal-india.site',
      paymentRequirement: 'Registration fee applicable: \u20B91,800',
    },
  },
};
