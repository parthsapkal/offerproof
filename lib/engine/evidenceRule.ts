import { Finding, OfferInput } from '../types';
import { extractEmailDomain, isPublicEmailDomain } from './domainUtils';

export function checkEvidenceCompletenessRule(input: OfferInput): Finding[] {
  const findings: Finding[] = [];

  const hasPastedText = Boolean(input.pastedText && input.pastedText.trim().length > 30);
  const hasExtractedDocText = Boolean(input.documentExtractedText && input.documentExtractedText.trim().length > 30);
  const hasDocument = Boolean(input.documentFileName);
  const hasListingUrl = Boolean(input.jobListingUrl && input.jobListingUrl.trim().length > 5);
  const hasCompanyWebsite = Boolean(input.companyWebsite && input.companyWebsite.trim().length > 3);
  const emailDomain = extractEmailDomain(input.recruiterEmail || '');
  const isFreeEmail = emailDomain ? isPublicEmailDomain(emailDomain) : true;

  // 1. Evaluate missing substantive documentation
  if (!hasPastedText && !hasExtractedDocText && !hasDocument) {
    findings.push({
      id: 'MISSING_OFFER_LETTER_TEXT',
      category: 'COMPLETENESS',
      severity: 'CAUTION',
      title: 'No Offer Letter Body or Document Uploaded for Detailed Analysis',
      evidence: 'Verification was submitted with only header fields; full letter text or contract terms were omitted.',
      explanation:
        'Internship scams often hide clauses (such as forced unpaid extensions, arbitrary penalties, or post-joining deposits) in the fine print of the formal offer letter.',
      recommendedAction:
        'Upload your offer letter PDF or paste the full email body to allow OfferProof to parse contract terms and verify corporate sign-offs.',
    });
  }

  // 2. High brand name recognition without recruiter verification (The Classic Impersonation Scenario)
  const isFamousBrandClaimed = [
    'google',
    'microsoft',
    'amazon',
    'tcs',
    'infosys',
    'wipro',
    'swiggy',
    'zomato',
    'cred',
    'flipkart',
    'razorpay',
    'tata',
    'reliance',
  ].some((brand) => input.companyName.toLowerCase().includes(brand));

  if (isFamousBrandClaimed && isFreeEmail && !hasListingUrl) {
    findings.push({
      id: 'INCONCLUSIVE_BRAND_IMPERSONATION_RISK',
      category: 'COMPLETENESS',
      severity: 'WARNING',
      title: 'Prominent Brand Name Claimed Without Recruiter Domain Authorization',
      evidence: `The offer claims affiliation with major brand "${input.companyName}", but lacks an authenticated corporate email and verifiable careers portal link.`,
      explanation:
        'Scammers frequently invoke reputable corporate brand names (like Swiggy, Cred, TCS, Google) to gain immediate trust from students, while using personal email accounts or informal chat channels to conduct interactions.',
      recommendedAction:
        'Do not accept this offer based on brand name alone. Reach out directly to the company\'s official talent acquisition team via their official LinkedIn company page or verified portal to confirm this recruiter\'s identity.',
    });
  }

  // 3. Overall missing evidence threshold
  let missingPoints = 0;
  if (!hasListingUrl) missingPoints++;
  if (!hasCompanyWebsite) missingPoints++;
  if (!input.recruiterName || input.recruiterName.trim().length < 2) missingPoints++;
  if (!input.recruiterEmail || isFreeEmail) missingPoints++;

  if (missingPoints >= 3) {
    findings.push({
      id: 'INSUFFICIENT_VERIFIABLE_EVIDENCE',
      category: 'COMPLETENESS',
      severity: 'CAUTION',
      title: 'Insufficient Verifiable Independent Evidence',
      evidence: `${missingPoints} key corporate verification anchors (official website, career link, corporate email, recruiter identity) are absent or unverified.`,
      explanation:
        'A comprehensive assessment requires verifiable digital breadcrumbs. When critical identifiers are missing, the assessment remains inconclusive regardless of how professional the text looks.',
      recommendedAction:
        'Request complete employer credentials including the corporate registered address, GST/CIN registration number, and an official corporate email trail.',
    });
  }

  return findings;
}
