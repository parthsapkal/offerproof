import { SampleCase } from './types';

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'sample-suspicious',
    category: 'suspicious',
    tag: 'Suspicious Case',
    title: '\u20B92,500 Upfront Fee & Pressure Deadline',
    companyDisplay: 'Apex Global Tech Solutions',
    shortDescription:
      'Recruiter uses a Gmail address, contacted candidate via Telegram, demands \u20B92,500 UPI registration fee within 4 hours, promising an inflated \u20B935,000 stipend with no interview.',
    keyHighlight: 'High Warning Signs (\u20B92,500 UPI fee + lookalike/free email + artificial panic)',
    input: {
      companyName: 'Apex Global Tech Solutions',
      companyWebsite: 'https://apex-techsolutions-india.online',
      recruiterName: 'Rohit Verma (HR Talent Acquisition)',
      recruiterEmail: 'rohit.hr.apexcareers@gmail.com',
      jobTitle: 'Data Processing & Operations Intern',
      jobListingUrl: 'https://bit.ly/apex-intern-slot',
      jobId: 'APX-DATA-2025',
      location: 'Remote / Work From Home',
      compensation: '\u20B935,000 / month',
      duration: '3 Months',
      applicationDeadline: 'Within 4 Hours',
      offerSource: 'telegram',
      feeRequested: true,
      feeAmount: 2500,
      feeReason: 'Mandatory internship registration fee & training kit security deposit',
      pastedText: `CONGRATULATIONS! You have been selected for the Data Processing & Web Operations Internship at Apex Global Tech Solutions.

Stipend: \u20B935,000 per month (work from home). Direct selection - no technical interview required.

CRITICAL INSTRUCTION: As per internal company protocol, candidate must pay a refundable registration fee and training software kit deposit of \u20B92,500.
Payment must be completed via UPI (apex.hr@upi) within 4 hours to book your slot.
Note: If payment is not submitted within 4 hours, your offer letter will be cancelled immediately and allotted to the next candidate on the waiting list. Submit UPI transaction screenshot to HR on Telegram.`,
      documentFileName: 'Apex_Offer_Letter_Provisional.pdf',
      documentFileType: 'application/pdf',
    },
  },
  {
    id: 'sample-lower-risk',
    category: 'lower_risk',
    tag: 'Lower Risk Case',
    title: 'Documented Campus Offer with Corporate Domain',
    companyDisplay: 'Razorpay Software Private Limited',
    shortDescription:
      'Verified via college placement cell, official @razorpay.com email, verifiable career listing URL, reference to 3 interview rounds, and strict zero-fee statement.',
    keyHighlight: 'Lower Risk (Official corporate domain + verifiable listing + \u20B90 fees)',
    input: {
      companyName: 'Razorpay Software Private Limited',
      companyWebsite: 'https://razorpay.com',
      recruiterName: 'Priya Nair (University Talent Acquisition)',
      recruiterEmail: 'priya.nair@razorpay.com',
      jobTitle: 'Software Engineering Intern (Frontend)',
      jobListingUrl: 'https://razorpay.com/careers/jobs/frontend-intern-2025',
      jobId: 'RZP-ENG-2025-042',
      location: 'Bangalore, Karnataka (Hybrid)',
      compensation: '\u20B935,000 / month',
      duration: '6 Months',
      applicationDeadline: '15 November 2025',
      demoScenarioId: 'matching_role',
      offerSource: 'campus',
      feeRequested: false,
      feeAmount: 0,
      feeReason: '',
      pastedText: `Dear Candidate,

Following your successful completion of the Razorpay Campus Coding Assessment, Technical Interview Round 1, and Engineering Managerial Discussion, we are delighted to offer you an internship as Software Engineering Intern (Frontend) at Razorpay Software Private Limited.

Role: Software Engineering Intern (Frontend)
Requisition ID: RZP-ENG-2025-042
Duration: 6 Months (Full-Time Internship)
Stipend: \u20B935,000 per month
Location: Bangalore, Karnataka (Hybrid)

Notice on Hiring Integrity: Razorpay does not charge any application, registration, processing, or equipment deposit fee from candidates at any point during or after the recruitment cycle. All official communication will come strictly from our verified @razorpay.com domain.`,
      documentFileName: 'Razorpay_Campus_Internship_Offer.pdf',
      documentFileType: 'application/pdf',
    },
  },
  {
    id: 'sample-inconclusive',
    category: 'inconclusive',
    tag: 'Inconclusive Case',
    title: 'Recognized Brand Name with Unverified Recruiter',
    companyDisplay: 'Swiggy (Bundl Technologies Pvt Ltd)',
    shortDescription:
      'The company name is a prominent Indian startup, but the contact reached out on Telegram with an unverified Outlook email and no official job listing link.',
    keyHighlight: 'Inconclusive (Brand looks legitimate, but recruiter domain cannot be authenticated)',
    input: {
      companyName: 'Swiggy (Bundl Technologies)',
      companyWebsite: 'https://www.swiggy.com',
      recruiterName: 'Kunal Sharma',
      recruiterEmail: 'kunal.talent.swiggy@outlook.com',
      jobTitle: 'Product Operations & Growth Intern',
      jobListingUrl: '',
      jobId: 'SWIG-OPS-331',
      location: 'Bangalore, Karnataka',
      compensation: '\u20B925,000 / month',
      duration: '3 Months',
      offerSource: 'telegram',
      feeRequested: false,
      feeAmount: null,
      feeReason: '',
      pastedText: `Hi Candidate,

I am Kunal Sharma from the Swiggy Talent Acquisition team. We reviewed your profile on LinkedIn and would like to invite you for a 3-month Product Operations & Growth Internship with our Bangalore operations team.

Role: Product Operations & Growth Intern (SWIG-OPS-331)
Stipend: \u20B925,000 per month.
Location: Bangalore, Karnataka

Please reply with your updated resume, college ID card photo, and phone number so we can schedule the onboarding briefing. All further updates will be coordinated via this Telegram recruitment group.`,
      documentFileName: 'Swiggy_Role_Overview.png',
      documentFileType: 'image/png',
    },
  },
];
