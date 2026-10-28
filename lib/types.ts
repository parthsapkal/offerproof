export type OfferSource =
  | 'linkedin'
  | 'telegram'
  | 'whatsapp'
  | 'internshala'
  | 'campus'
  | 'cold_email'
  | 'job_portal'
  | 'social_media'
  | 'other';

export interface OfferInput {
  companyName: string;
  companyWebsite: string;
  recruiterName: string;
  recruiterEmail: string;
  jobTitle: string;
  jobListingUrl: string;
  offerSource: OfferSource | string;
  feeRequested: boolean;
  feeAmount?: number | null;
  feeReason?: string;
  pastedText: string;
  documentFileName?: string;
  documentFileType?: string;
  documentExtractedText?: string;
}

export type FindingSeverity = 'CRITICAL' | 'WARNING' | 'CAUTION' | 'VERIFIED';

export type FindingCategory =
  | 'FEE'
  | 'DOMAIN_EMAIL'
  | 'COMMUNICATION_CHANNEL'
  | 'CONTENT_TACTICS'
  | 'COMPLETENESS';

export interface Finding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  evidence: string;
  explanation: string;
  recommendedAction: string;
}

export type AssessmentStatus = 'HIGH_WARNING' | 'LOWER_RISK' | 'INCONCLUSIVE';

export interface ObservedFact {
  label: string;
  value: string;
  status: 'FLAGGED' | 'VERIFIED' | 'NEUTRAL' | 'MISSING';
  detail?: string;
}

export interface VerificationReport {
  id: string;
  timestamp: string;
  overallAssessment: {
    status: AssessmentStatus;
    badgeLabel: string;
    headline: string;
    summary: string;
    color: 'red' | 'teal' | 'amber';
  };
  metrics: {
    criticalCount: number;
    warningCount: number;
    cautionCount: number;
    verifiedCount: number;
  };
  findings: Finding[];
  observedFacts: ObservedFact[];
  unverifiedAspects: string[];
  limitations: string[];
  recommendedNextSteps: string[];
  inputSnapshot: OfferInput;
}

export interface SampleCase {
  id: string;
  category: 'suspicious' | 'lower_risk' | 'inconclusive';
  tag: string;
  title: string;
  companyDisplay: string;
  shortDescription: string;
  keyHighlight: string;
  input: OfferInput;
}
