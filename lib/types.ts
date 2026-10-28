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
  // Extended fields for Official Listing Match
  jobId?: string;
  location?: string;
  compensation?: string;
  duration?: string;
  applicationDeadline?: string;
  demoScenarioId?: string;
}

export type FindingSeverity = 'CRITICAL' | 'WARNING' | 'CAUTION' | 'VERIFIED';

export type FindingCategory =
  | 'FEE'
  | 'DOMAIN_EMAIL'
  | 'COMMUNICATION_CHANNEL'
  | 'CONTENT_TACTICS'
  | 'COMPLETENESS'
  | 'LISTING_MATCH';

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

export type ListingMatchStatus =
  | 'STRONG_MATCH'
  | 'PARTIAL_MATCH'
  | 'MISMATCH_DETECTED'
  | 'NO_MATCHING_LISTING'
  | 'UNABLE_TO_VERIFY'
  | 'USER_PROVIDED_UNVERIFIED';

export type FieldMatchStatus = 'MATCH' | 'MISMATCH' | 'NOT_AVAILABLE';

export interface FieldComparison {
  fieldName: string;
  fieldLabel: string;
  submittedValue: string;
  listingValue: string;
  status: FieldMatchStatus;
  explanation: string;
  isSecurityCritical?: boolean;
}

export interface PillarVerificationDetail {
  status: 'VERIFIED' | 'CAUTION' | 'SUSPICIOUS' | 'CONFIRMED' | 'UNCONFIRMED' | 'PARTIAL' | 'MISMATCH' | 'UNVERIFIED';
  label: string;
  summary: string;
  evidence: string;
  actionRequired: string;
}

export interface ThreePillarVerification {
  companyLegitimacy: PillarVerificationDetail;
  listingMatch: PillarVerificationDetail;
  recruiterAuthorization: PillarVerificationDetail;
  guidanceNote: string;
}

export interface OfficialListingMatchResult {
  status: ListingMatchStatus;
  statusLabel: string;
  summary: string;
  color: 'teal' | 'amber' | 'red' | 'blue' | 'gray';
  listingUrl: string | null;
  sourceDomain: string | null;
  isIndependentlyVerifiedSource: boolean;
  sourceType:
    | 'OFFICIAL_CAREERS_PORTAL'
    | 'AUTHORIZED_ATS'
    | 'UNVERIFIED_THIRD_PARTY'
    | 'SUSPICIOUS_LOOKALIKE'
    | 'NONE';
  checkedAt: string;
  fields: FieldComparison[];
  matchedCount: number;
  mismatchedCount: number;
  unavailableCount: number;
  suspiciousDifferences: string[];
  recommendedNextSteps: string[];
  threePillarVerification: ThreePillarVerification;
  isSimulatedDemo?: boolean;
  simulatedScenarioTitle?: string;
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
  officialListingMatch?: OfficialListingMatchResult;
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

export interface DemoListingScenario {
  id: string;
  title: string;
  shortDescription: string;
  expectedStatus: ListingMatchStatus;
  input: OfferInput;
}
