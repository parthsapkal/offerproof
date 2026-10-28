import { extractApexDomain, extractHostname, detectLookalikeSuspicion } from './domainUtils';

export const RECOGNIZED_ATS_PROVIDERS: Record<string, string> = {
  'greenhouse.io': 'Greenhouse ATS',
  'boards.greenhouse.io': 'Greenhouse Job Board',
  'lever.co': 'Lever ATS',
  'jobs.lever.co': 'Lever Job Board',
  'myworkdayjobs.com': 'Workday Enterprise Careers',
  'workday.com': 'Workday Careers',
  'smartrecruiters.com': 'SmartRecruiters ATS',
  'darwinbox.in': 'Darwinbox HR Tech',
  'keka.com': 'Keka HR Portal',
  'internshala.com': 'Internshala Student Internship Portal',
  'unstop.com': 'Unstop Campus & Hiring Platform',
  'naukri.com': 'Naukri.com Corporate Job Portal',
  'linkedin.com': 'LinkedIn Talent Solutions',
  'wellfound.com': 'Wellfound (AngelList Talent)',
  'hirist.tech': 'Hirist Tech Careers',
  'ashbyhq.com': 'Ashby ATS',
};

export interface SourceValidationResult {
  sourceType:
    | 'OFFICIAL_CAREERS_PORTAL'
    | 'AUTHORIZED_ATS'
    | 'UNVERIFIED_THIRD_PARTY'
    | 'SUSPICIOUS_LOOKALIKE'
    | 'NONE';
  isIndependentlyVerified: boolean;
  sourceDomain: string;
  providerLabel: string;
  explanation: string;
  warningNotice?: string;
}

export function validateListingSource(
  listingUrl: string,
  companyWebsite: string,
  companyName: string
): SourceValidationResult {
  if (!listingUrl) {
    return {
      sourceType: 'NONE',
      isIndependentlyVerified: false,
      sourceDomain: '',
      providerLabel: 'No Listing URL Provided',
      explanation: 'No URL to an official career portal or job listing was supplied.',
    };
  }

  const listingHost = extractHostname(listingUrl);
  if (!listingHost) {
    return {
      sourceType: 'NONE',
      isIndependentlyVerified: false,
      sourceDomain: '',
      providerLabel: 'Invalid Domain',
      explanation: 'The provided listing URL does not resolve to a valid web host.',
    };
  }

  const listingApex = extractApexDomain(listingHost);
  const companyHost = extractHostname(companyWebsite);
  const companyApex = companyHost ? extractApexDomain(companyHost) : null;

  // 1. Check for suspicious lookalike domain
  const lookalike = detectLookalikeSuspicion(listingHost, companyApex, companyName);
  if (lookalike.isSuspicious) {
    return {
      sourceType: 'SUSPICIOUS_LOOKALIKE',
      isIndependentlyVerified: false,
      sourceDomain: listingHost,
      providerLabel: 'Deceptive Lookalike Domain',
      explanation:
        'The listing domain exhibits characteristics of domain spoofing or deceptive keyword registration.',
      warningNotice: lookalike.reason || 'Domain masquerades as corporate hiring portal.',
    };
  }

  // 2. Check if host matches the claimed company's official domain
  if (companyApex && (listingApex === companyApex || listingHost.endsWith('.' + companyApex))) {
    return {
      sourceType: 'OFFICIAL_CAREERS_PORTAL',
      isIndependentlyVerified: true,
      sourceDomain: listingHost,
      providerLabel: `Official Corporate Portal (${companyApex})`,
      explanation:
        `The listing is directly hosted on the claimed company's verified primary domain ("${companyApex}").`,
    };
  }

  // 3. Check if host matches a recognized, authorized Applicant Tracking System (ATS)
  for (const [atsDomain, label] of Object.entries(RECOGNIZED_ATS_PROVIDERS)) {
    if (listingHost === atsDomain || listingHost.endsWith('.' + atsDomain)) {
      return {
        sourceType: 'AUTHORIZED_ATS',
        isIndependentlyVerified: true,
        sourceDomain: listingHost,
        providerLabel: label,
        explanation: `The listing is hosted on an enterprise-grade, independently recognized recruitment system (${label}).`,
      };
    }
  }

  // 4. User-provided third party domain (cannot independently establish as official)
  return {
    sourceType: 'UNVERIFIED_THIRD_PARTY',
    isIndependentlyVerified: false,
    sourceDomain: listingHost,
    providerLabel: 'User-Provided Source — Not Independently Verified',
    explanation:
      `The domain "${listingHost}" was supplied by the user, but cannot be independently confirmed as an authorized corporate hiring portal for "${companyName}".`,
    warningNotice:
      'Never treat a domain as official merely because its design appears professional. Fraudulent operators frequently create convincing clones.',
  };
}
