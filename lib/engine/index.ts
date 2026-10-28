import {
  AssessmentStatus,
  Finding,
  ObservedFact,
  OfferInput,
  VerificationReport,
} from '../types';
import { checkFeeRule } from './feeRule';
import { checkDomainAndEmailRules } from './domainRule';
import { checkOfferSourceRule } from './sourceRule';
import { checkTextAnalysisRules } from './textAnalysisRule';
import { checkEvidenceCompletenessRule } from './evidenceRule';
import { extractApexDomain, extractEmailDomain, extractHostname } from './domainUtils';

/**
 * Main Deterministic Verification Engine Orchestrator
 */
export function runVerificationEngine(input: OfferInput): VerificationReport {
  // Aggregate all rule findings
  const allFindings: Finding[] = [
    ...checkFeeRule(input),
    ...checkDomainAndEmailRules(input),
    ...checkOfferSourceRule(input),
    ...checkTextAnalysisRules(input),
    ...checkEvidenceCompletenessRule(input),
  ];

  // Count severities
  const criticalCount = allFindings.filter((f) => f.severity === 'CRITICAL').length;
  const warningCount = allFindings.filter((f) => f.severity === 'WARNING').length;
  const cautionCount = allFindings.filter((f) => f.severity === 'CAUTION').length;
  const verifiedCount = allFindings.filter((f) => f.severity === 'VERIFIED').length;

  // Determine overall assessment deterministically
  let status: AssessmentStatus = 'INCONCLUSIVE';
  let badgeLabel = 'Inconclusive / Insufficient Evidence';
  let headline = 'Unverified Identity or Insufficient Verification Data';
  let summary =
    'While no immediate financial extortion was detected, critical independent verification anchors (such as corporate email domain match or official job listing) could not be verified.';
  let color: 'red' | 'teal' | 'amber' = 'amber';

  if (criticalCount > 0) {
    status = 'HIGH_WARNING';
    badgeLabel = 'High Warning Signs / Suspicious';
    headline = 'Significant Red Flags & Potential Student Fraud Indicators';
    summary =
      'One or more high-severity warning signs were identified—such as upfront fee demands, domain spoofing, or deceptive task practices. We strongly advise against paying money or sharing private credentials.';
    color = 'red';
  } else if (
    criticalCount === 0 &&
    warningCount === 0 &&
    verifiedCount >= 2 &&
    cautionCount <= 1
  ) {
    status = 'LOWER_RISK';
    badgeLabel = 'Lower Risk / Verified Indicators';
    headline = 'Verifiable Corporate Hiring Indicators Observed';
    summary =
      'The submitted details align with legitimate corporate recruitment norms (matching authenticated domain, no fee requested, verifiable role). Note: This does not guarantee complete genuineness; always independently confirm via official HR.';
    color = 'teal';
  } else {
    status = 'INCONCLUSIVE';
    badgeLabel = 'Inconclusive / Insufficient Evidence';
    headline = 'Unverified Recruiter Identity or Missing Evidence';
    summary =
      'The company name looks legitimate or plausible, but the recruiter\'s direct affiliation cannot be confirmed with the submitted evidence. Additional independent verification is necessary.';
    color = 'amber';
  }

  // Construct Observed Facts
  const companyHost = extractHostname(input.companyWebsite || '');
  const emailDomain = extractEmailDomain(input.recruiterEmail || '');

  const observedFacts: ObservedFact[] = [
    {
      label: 'Target Company',
      value: input.companyName || 'Not specified',
      status: input.companyName ? 'NEUTRAL' : 'MISSING',
    },
    {
      label: 'Company Website Domain',
      value: companyHost ? extractApexDomain(companyHost) : 'None provided',
      status: companyHost ? 'NEUTRAL' : 'MISSING',
    },
    {
      label: 'Recruiter Email Domain',
      value: emailDomain ? `@${emailDomain}` : 'None provided',
      status: !emailDomain
        ? 'MISSING'
        : emailDomain.includes('gmail') || emailDomain.includes('yahoo') || emailDomain.includes('outlook')
        ? 'FLAGGED'
        : 'NEUTRAL',
    },
    {
      label: 'Communication Channel',
      value: input.offerSource ? input.offerSource.toUpperCase() : 'Unspecified',
      status:
        input.offerSource === 'telegram'
          ? 'FLAGGED'
          : input.offerSource === 'campus'
          ? 'VERIFIED'
          : 'NEUTRAL',
    },
    {
      label: 'Upfront Fee Demanded',
      value: input.feeRequested
        ? `YES (\u20B9${input.feeAmount || 'unspecified'}${input.feeReason ? ` for ${input.feeReason}` : ''})`
        : 'NO (\u20B90)',
      status: input.feeRequested ? 'FLAGGED' : 'VERIFIED',
    },
    {
      label: 'Offer Document Attached',
      value: input.documentFileName
        ? `${input.documentFileName} (${input.documentFileType || 'File'})`
        : input.pastedText
        ? 'Pasted Offer Text Provided'
        : 'No Document / Text Provided',
      status: input.documentFileName || input.pastedText ? 'NEUTRAL' : 'MISSING',
    },
  ];

  // Specific Unverified Aspects
  const unverifiedAspects: string[] = [
    'Offline Corporate Registration: Company\'s active CIN status on Ministry of Corporate Affairs (MCA.gov.in) has not been queried via real-time database.',
    'Internal Corporate HR Records: Whether this specific recruiter name is an active employee on the company payroll cannot be confirmed without internal HR access.',
    'Physical Letterhead Authenticity: Signatures, physical rubber stamps, and letterhead watermarks cannot be forensically validated purely from digital text.',
    'Verbal Communication: Any telephone promises, WhatsApp voice notes, or off-the-record verbal commitments cannot be analyzed.',
  ];

  // Specific Limitations
  const limitations: string[] = [
    'OfferProof uses deterministic heuristic rules based on documented Indian student internship scams and AICTE guidelines; it does not replace legal or police investigation.',
    'A "Lower Risk" finding does not certify that an offer is 100% authentic; sophisticated threat actors may occasionally clone genuine email headers.',
    'An "Inconclusive" finding means the available digital evidence was insufficient to confirm identity; it is not a declaration of guilt.',
    'OfferProof never executes uploaded files, never contacts the employer directly, and never stores private student offer letters.',
  ];

  // Recommended Next Steps
  const recommendedNextSteps: string[] = [];

  if (status === 'HIGH_WARNING') {
    recommendedNextSteps.push(
      'Cease all communication and NEVER send money via UPI, QR code, NetBanking, or payment links.',
      'Report the incident to the National Cyber Crime Reporting Portal at https://cybercrime.gov.in or call 1930.',
      'Alert your college Training and Placement Officer (TPO) to prevent classmates from falling for the same recruiter.',
      'If you already shared Aadhaar or bank details, monitor your accounts and consider filing a cyber complaint.'
    );
  } else if (status === 'INCONCLUSIVE') {
    recommendedNextSteps.push(
      'Do not accept or sign anything until the recruiter\'s corporate identity is proven.',
      'Look up the company\'s official website independently (do not use links provided in the suspicious message) and contact their HR department.',
      'Request the recruiter to send the formal offer from their official corporate email domain (e.g., @company.com), not an instant messenger.',
      'Search the company name on MCA (mca.gov.in) to verify their registered office address and Corporate Identification Number (CIN).'
    );
  } else {
    recommendedNextSteps.push(
      'Verify the incoming email headers (DKIM/SPF) in your mail client to confirm the sender was not spoofed.',
      'Compare the internship stipend and start date with the public job posting on the company\'s career portal.',
      'Contact the company\'s main HR switchboard or message an employee in the same team on LinkedIn to confirm the vacancy is legitimate.',
      'Ensure you never pay any "laptop deposit" or "document charge" later during onboarding.'
    );
  }

  const reportId = `OP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return {
    id: reportId,
    timestamp: new Date().toISOString(),
    overallAssessment: {
      status,
      badgeLabel,
      headline,
      summary,
      color,
    },
    metrics: {
      criticalCount,
      warningCount,
      cautionCount,
      verifiedCount,
    },
    findings: allFindings,
    observedFacts,
    unverifiedAspects,
    limitations,
    recommendedNextSteps,
    inputSnapshot: input,
  };
}
