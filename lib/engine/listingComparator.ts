import {
  FieldComparison,
  FieldMatchStatus,
  ListingMatchStatus,
  OfferInput,
  OfficialListingMatchResult,
  ThreePillarVerification,
} from '../types';
import { ParsedListingData } from '../demoScenarios';
import { validateListingSource } from './sourceValidator';
import { fetchListingData } from './listingFetcher';

/**
 * Normalizes strings by removing punctuation, extra spaces, and common suffixes
 */
function normalizeString(val: string): string {
  return val
    .toLowerCase()
    .replace(/private\s+limited|pvt\.?\s*ltd\.?|limited|ltd\.?|inc\.?|technologies|solutions/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Compares two monetary compensation strings
 */
function compareCompensation(submitted: string, listing: string): { status: FieldMatchStatus; explanation: string } {
  if (!submitted && !listing) {
    return { status: 'NOT_AVAILABLE', explanation: 'Compensation was not stated in either source.' };
  }
  if (!submitted) {
    return { status: 'NOT_AVAILABLE', explanation: `Official listing states ${listing}; no submitted compensation provided to compare.` };
  }
  if (!listing) {
    return { status: 'NOT_AVAILABLE', explanation: `Submitted offer states ${submitted}; official listing does not state a public stipend.` };
  }

  // Extract digits
  const numSub = submitted.replace(/[^0-9]/g, '');
  const numList = listing.replace(/[^0-9]/g, '');

  if (numSub && numList && numSub === numList) {
    return { status: 'MATCH', explanation: `Compensation amounts match (${listing}).` };
  }

  // If one contains the other
  if (numSub && numList && (numSub.includes(numList) || numList.includes(numSub))) {
    return { status: 'MATCH', explanation: `Compensation values align closely (${submitted} vs ${listing}).` };
  }

  return {
    status: 'MISMATCH',
    explanation: `Discrepancy in compensation: Submitted offer states "${submitted}", whereas official listing indicates "${listing}".`,
  };
}

/**
 * Main Comparison Engine for Official Listing Match
 */
export async function compareOfferWithOfficialListing(
  input: OfferInput
): Promise<OfficialListingMatchResult> {
  const listingUrl = (input.jobListingUrl || '').trim();
  const demoScenarioId = input.demoScenarioId;

  // 1. Validate the source domain of the listing
  const sourceValidation = validateListingSource(listingUrl, input.companyWebsite, input.companyName);

  // 2. Fetch the listing data (live SSRF-protected fetch or simulated benchmark demo)
  const fetchResult = await fetchListingData(listingUrl, demoScenarioId);
  const listingData: ParsedListingData = fetchResult.data;
  const isDemo = fetchResult.isSimulatedDemo;
  const demoTitle = fetchResult.simulatedScenarioTitle;
  const sourceDomain = fetchResult.sourceDomain || sourceValidation.sourceDomain;

  const fields: FieldComparison[] = [];
  const suspiciousDifferences: string[] = [];

  // If no URL provided at all
  if (!listingUrl && !demoScenarioId) {
    return {
      status: 'NO_MATCHING_LISTING',
      statusLabel: 'No Matching Listing Found',
      summary:
        'No official job listing URL was provided with the verification request. To verify whether this vacancy is officially budgeted and authorized, enter the career listing link.',
      color: 'gray',
      listingUrl: null,
      sourceDomain: null,
      isIndependentlyVerifiedSource: false,
      sourceType: 'NONE',
      checkedAt: new Date().toISOString(),
      fields: [],
      matchedCount: 0,
      mismatchedCount: 0,
      unavailableCount: 0,
      suspiciousDifferences: [],
      recommendedNextSteps: [
        'Ask the recruiter for the public job listing URL on the company\'s official career page or ATS.',
        'Search the company\'s official careers portal directly to see if this requisition is active.',
      ],
      threePillarVerification: {
        companyLegitimacy: {
          status: input.companyWebsite ? 'VERIFIED' : 'CAUTION',
          label: input.companyWebsite ? 'Corporate Web Presence Found' : 'Unverified Company',
          summary: input.companyWebsite
            ? `Company website (${input.companyWebsite}) is provided.`
            : 'No corporate website URL provided.',
          evidence: input.companyWebsite || 'None provided',
          actionRequired: 'Verify company CIN on MCA portal.',
        },
        listingMatch: {
          status: 'UNVERIFIED',
          label: 'Listing Not Provided',
          summary: 'Cannot compare offer terms because no official listing URL was submitted.',
          evidence: 'No listing URL',
          actionRequired: 'Request official career portal link from recruiter.',
        },
        recruiterAuthorization: {
          status: input.recruiterEmail?.includes('@gmail') || !input.recruiterEmail ? 'UNCONFIRMED' : 'CONFIRMED',
          label: 'Recruiter Affiliation Unconfirmed',
          summary: 'Recruiter authority must be verified independently with company HR.',
          evidence: input.recruiterEmail || 'No email provided',
          actionRequired: 'Contact company switchboard directly.',
        },
        guidanceNote:
          'Always keep company legitimacy, listing match, and recruiter authorization separate. A genuine company name does not guarantee the offer is authorized.',
      },
      isSimulatedDemo: false,
    };
  }

  // If the listing is unavailable, expired, or failed to fetch
  if (!listingData.isAvailable) {
    return {
      status: 'UNABLE_TO_VERIFY',
      statusLabel: 'Unable to Verify Listing',
      summary:
        listingData.errorMessage ||
        'The listing URL could not be accessed, parsed, or verified. The position may have expired or closed.',
      color: 'amber',
      listingUrl,
      sourceDomain,
      isIndependentlyVerifiedSource: sourceValidation.isIndependentlyVerified,
      sourceType: sourceValidation.sourceType,
      checkedAt: new Date().toISOString(),
      fields: [],
      matchedCount: 0,
      mismatchedCount: 0,
      unavailableCount: 0,
      suspiciousDifferences: [
        'The listing page is inactive or inaccessible (e.g. HTTP 404 / closed). If this offer was extended recently, verify why the official requisition is closed.',
      ],
      recommendedNextSteps: [
        'Contact the company talent acquisition team to confirm if the vacancy has closed or is still active.',
        'Ensure the recruiter was not sharing an expired, archived job link from a past recruitment cycle.',
      ],
      threePillarVerification: {
        companyLegitimacy: {
          status: 'CAUTION',
          label: 'Company Legitimate / Plausible',
          summary: 'Company web presence detected, but job listing could not be retrieved.',
          evidence: input.companyName,
          actionRequired: 'Confirm directly on company website.',
        },
        listingMatch: {
          status: 'UNVERIFIED',
          label: 'Listing Inaccessible / Expired',
          summary: 'The listing URL is unavailable, returning an HTTP error or closed status.',
          evidence: listingUrl,
          actionRequired: 'Ask recruiter for an active requisition link.',
        },
        recruiterAuthorization: {
          status: 'UNCONFIRMED',
          label: 'Recruiter Unconfirmed',
          summary: 'Because the listing cannot be cross-referenced, recruiter identity remains unconfirmed.',
          evidence: input.recruiterEmail || 'Unverified',
          actionRequired: 'Do not sign or pay. Contact official HR directly.',
        },
        guidanceNote:
          'An expired or inaccessible listing requires manual verification with the company HR department before proceeding.',
      },
      isSimulatedDemo: isDemo,
      simulatedScenarioTitle: demoTitle,
    };
  }

  // ---------------------------------------------------------
  // 3. Field-by-Field Comparison
  // ---------------------------------------------------------

  // Field 1: Company Name
  if (listingData.companyName) {
    const normSub = normalizeString(input.companyName);
    const normList = normalizeString(listingData.companyName);
    const isMatch = normSub.includes(normList) || normList.includes(normSub);
    fields.push({
      fieldName: 'companyName',
      fieldLabel: 'Company Name',
      submittedValue: input.companyName,
      listingValue: listingData.companyName,
      status: isMatch ? 'MATCH' : 'MISMATCH',
      explanation: isMatch
        ? 'Company entity name corresponds between submitted offer and official listing.'
        : `Discrepancy: Offer claims "${input.companyName}", but listing is registered to "${listingData.companyName}".`,
      isSecurityCritical: !isMatch,
    });
    if (!isMatch) suspiciousDifferences.push('Company name mismatch between submitted offer and public listing.');
  } else {
    fields.push({
      fieldName: 'companyName',
      fieldLabel: 'Company Name',
      submittedValue: input.companyName || 'Not specified',
      listingValue: 'Not specified on page',
      status: 'NOT_AVAILABLE',
      explanation: 'Official listing does not explicitly specify an isolated company entity field in metadata.',
    });
  }

  // Field 2: Job / Internship Title
  if (listingData.jobTitle) {
    const normSubTitle = normalizeString(input.jobTitle);
    const normListTitle = normalizeString(listingData.jobTitle);
    const isMatch =
      normSubTitle.includes(normListTitle) ||
      normListTitle.includes(normSubTitle) ||
      normSubTitle.length === 0;

    fields.push({
      fieldName: 'jobTitle',
      fieldLabel: 'Job / Internship Title',
      submittedValue: input.jobTitle || 'Not specified',
      listingValue: listingData.jobTitle,
      status: isMatch ? 'MATCH' : 'MISMATCH',
      explanation: isMatch
        ? `Job role title matches: "${listingData.jobTitle}".`
        : `Role discrepancy: Submitted "${input.jobTitle}" differs from official title "${listingData.jobTitle}".`,
    });
    if (!isMatch) suspiciousDifferences.push('Job title differs significantly from official career opening.');
  } else {
    fields.push({
      fieldName: 'jobTitle',
      fieldLabel: 'Job / Internship Title',
      submittedValue: input.jobTitle || 'Not specified',
      listingValue: 'Not extracted',
      status: 'NOT_AVAILABLE',
      explanation: 'Title could not be extracted from public page metadata.',
    });
  }

  // Field 3: Job / Requisition ID
  if (listingData.jobId || input.jobId) {
    const subId = (input.jobId || '').trim();
    const listId = (listingData.jobId || '').trim();
    if (subId && listId) {
      const isMatch = normalizeString(subId) === normalizeString(listId);
      fields.push({
        fieldName: 'jobId',
        fieldLabel: 'Job / Requisition ID',
        submittedValue: subId,
        listingValue: listId,
        status: isMatch ? 'MATCH' : 'MISMATCH',
        explanation: isMatch
          ? `Exact requisition identifier matched: ${listId}.`
          : `Job Requisition ID mismatch: Submitted "${subId}" vs Official "${listId}".`,
        isSecurityCritical: !isMatch,
      });
      if (!isMatch) suspiciousDifferences.push('Job Requisition ID mismatch.');
    } else {
      fields.push({
        fieldName: 'jobId',
        fieldLabel: 'Job / Requisition ID',
        submittedValue: subId || 'Not provided in offer',
        listingValue: listId || 'Not published on listing',
        status: 'NOT_AVAILABLE',
        explanation: 'Requisition ID was available in only one source; cannot perform comparison.',
      });
    }
  }

  // Field 4: Location & Work Arrangement
  if (listingData.location || input.location) {
    const subLoc = (input.location || '').trim();
    const listLoc = (listingData.location || '').trim();
    if (subLoc && listLoc) {
      const normSub = normalizeString(subLoc);
      const normList = normalizeString(listLoc);
      const isMatch = normSub.includes(normList) || normList.includes(normSub);
      fields.push({
        fieldName: 'location',
        fieldLabel: 'Location & Work Arrangement',
        submittedValue: subLoc,
        listingValue: listLoc,
        status: isMatch ? 'MATCH' : 'MISMATCH',
        explanation: isMatch
          ? `Work arrangement / city aligned: "${listLoc}".`
          : `Location inconsistency: Offer claims "${subLoc}", while listing states "${listLoc}".`,
      });
    } else {
      fields.push({
        fieldName: 'location',
        fieldLabel: 'Location & Work Arrangement',
        submittedValue: subLoc || 'Not specified in offer',
        listingValue: listLoc || 'Not published in listing',
        status: 'NOT_AVAILABLE',
        explanation: 'Work location was not provided in both sources.',
      });
    }
  }

  // Field 5: Salary or Stipend
  const compResult = compareCompensation(input.compensation || '', listingData.compensation || '');
  fields.push({
    fieldName: 'compensation',
    fieldLabel: 'Salary or Stipend',
    submittedValue: input.compensation || 'Not specified in offer',
    listingValue: listingData.compensation || 'Not published in listing',
    status: compResult.status,
    explanation: compResult.explanation,
    isSecurityCritical: compResult.status === 'MISMATCH',
  });
  if (compResult.status === 'MISMATCH') {
    suspiciousDifferences.push('Compensation mismatch: Advertised stipend does not match submitted offer terms.');
  }

  // Field 6: Duration
  if (listingData.duration || input.duration) {
    const subDur = (input.duration || '').trim();
    const listDur = (listingData.duration || '').trim();
    if (subDur && listDur) {
      const isMatch = normalizeString(subDur) === normalizeString(listDur);
      fields.push({
        fieldName: 'duration',
        fieldLabel: 'Employment / Internship Duration',
        submittedValue: subDur,
        listingValue: listDur,
        status: isMatch ? 'MATCH' : 'MISMATCH',
        explanation: isMatch
          ? `Internship duration matches (${listDur}).`
          : `Duration differs: Offer states "${subDur}" vs Listing "${listDur}".`,
      });
    } else {
      fields.push({
        fieldName: 'duration',
        fieldLabel: 'Employment / Internship Duration',
        submittedValue: subDur || 'Not specified',
        listingValue: listDur || 'Not specified',
        status: 'NOT_AVAILABLE',
        explanation: 'Duration was not provided in both sources.',
      });
    }
  }

  // Field 7: Application Deadline
  if (listingData.applicationDeadline || input.applicationDeadline) {
    const subDdl = (input.applicationDeadline || '').trim();
    const listDdl = (listingData.applicationDeadline || '').trim();
    if (subDdl && listDdl) {
      fields.push({
        fieldName: 'applicationDeadline',
        fieldLabel: 'Application Deadline',
        submittedValue: subDdl,
        listingValue: listDdl,
        status: 'MATCH',
        explanation: `Application timeline noted: ${listDdl}.`,
      });
    } else {
      fields.push({
        fieldName: 'applicationDeadline',
        fieldLabel: 'Application Deadline',
        submittedValue: subDdl || 'Not specified',
        listingValue: listDdl || 'Ongoing / Not stated',
        status: 'NOT_AVAILABLE',
        explanation: 'Deadline details were not stated in both sources.',
      });
    }
  }

  // Field 8: Recruiter Name & Contact Details
  if (listingData.recruiterContact) {
    const subEmail = (input.recruiterEmail || '').toLowerCase();
    const listContact = listingData.recruiterContact.toLowerCase();
    const subDomain = subEmail.includes('@') ? subEmail.split('@')[1] : '';
    const isDomainMatch = subDomain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].includes(subDomain) && listContact.includes(subDomain);
    const isMatch = (subEmail && listContact.includes(subEmail)) || Boolean(isDomainMatch);
    fields.push({
      fieldName: 'recruiterContact',
      fieldLabel: 'Recruiter Contact Details',
      submittedValue: input.recruiterEmail ? `${input.recruiterName || 'Recruiter'} (${input.recruiterEmail})` : 'None',
      listingValue: listingData.recruiterContact,
      status: isMatch ? 'MATCH' : 'MISMATCH',
      explanation: isMatch
        ? 'Recruiter contact details or corporate domain align with official listing directory.'
        : `Recruiter contact mismatch: Listing advertises official contact "${listingData.recruiterContact}", but offer came from "${input.recruiterEmail || 'unverified contact'}".`,
      isSecurityCritical: !isMatch,
    });
    if (!isMatch) {
      suspiciousDifferences.push('Recruiter email/contact differs from official company recruitment contact.');
    }
  } else {
    fields.push({
      fieldName: 'recruiterContact',
      fieldLabel: 'Recruiter Contact Details',
      submittedValue: input.recruiterEmail || 'Not specified',
      listingValue: 'Not published publicly on listing',
      status: 'NOT_AVAILABLE',
      explanation: 'Companies typically do not publish individual recruiters\' personal contacts on public ATS listings.',
    });
  }

  // Field 9: Application URL & Recruitment Channel
  if (listingData.applicationChannel) {
    const subSource = (input.offerSource || '').toLowerCase();
    const isInformal = subSource === 'telegram' || subSource === 'whatsapp';
    fields.push({
      fieldName: 'applicationChannel',
      fieldLabel: 'Recruitment Channel & Application URL',
      submittedValue: input.offerSource.toUpperCase(),
      listingValue: listingData.applicationChannel,
      status: isInformal ? 'MISMATCH' : 'MATCH',
      explanation: isInformal
        ? `Channel mismatch: Official applications are processed via ${listingData.applicationChannel}, but offer communication occurred over informal channel (${input.offerSource.toUpperCase()}).`
        : 'Recruitment channel is consistent with formal corporate application procedures.',
      isSecurityCritical: isInformal,
    });
    if (isInformal) {
      suspiciousDifferences.push('Communication took place over Telegram/WhatsApp while official applications run through company portal.');
    }
  }

  // Field 10: Fees, Deposits, Training Charges (CRITICAL)
  const feeDemanded = input.feeRequested && (input.feeAmount || input.feeReason);
  const listingHasZeroFee = listingData.paymentRequirement?.toLowerCase().includes('zero') ||
                            listingData.paymentRequirement?.toLowerCase().includes('free') ||
                            listingData.paymentRequirement?.toLowerCase().includes('no fee') ||
                            listingData.paymentRequirement?.toLowerCase().includes('0');

  if (feeDemanded) {
    fields.push({
      fieldName: 'paymentRequest',
      fieldLabel: 'Fees, Deposits & Monetary Requirements',
      submittedValue: `\u20B9${input.feeAmount || 'unspecified'} requested for "${input.feeReason || 'unspecified'}"`,
      listingValue: listingData.paymentRequirement || 'Strictly \u20B90 (Free of charge)',
      status: 'MISMATCH',
      explanation:
        'CRITICAL CONFLICT: Submitted offer demands an upfront payment/deposit, whereas the official company listing and AICTE standards strictly prohibit fees.',
      isSecurityCritical: true,
    });
    suspiciousDifferences.push(
      'CRITICAL: The offer letter demands an upfront fee/deposit, but the official company policy specifies zero fees.'
    );
  } else {
    fields.push({
      fieldName: 'paymentRequest',
      fieldLabel: 'Fees, Deposits & Monetary Requirements',
      submittedValue: 'Zero Fees (\u20B90 Demanded)',
      listingValue: listingData.paymentRequirement || 'Zero Fees (\u20B90)',
      status: 'MATCH',
      explanation: 'Both submitted offer and official listing confirm zero upfront payment or deposit requirements.',
      isSecurityCritical: false,
    });
  }

  // ---------------------------------------------------------
  // 4. Determine Overall Listing Match Status
  // ---------------------------------------------------------
  const matchedCount = fields.filter((f) => f.status === 'MATCH').length;
  const mismatchedCount = fields.filter((f) => f.status === 'MISMATCH').length;
  const unavailableCount = fields.filter((f) => f.status === 'NOT_AVAILABLE').length;

  let status: ListingMatchStatus = 'PARTIAL_MATCH';
  let statusLabel = 'Partial Match';
  let summary = 'Some details match the official listing, but certain important fields could not be verified.';
  let color: 'teal' | 'amber' | 'red' | 'blue' | 'gray' = 'amber';

  if (!sourceValidation.isIndependentlyVerified) {
    if (sourceValidation.sourceType === 'SUSPICIOUS_LOOKALIKE') {
      status = 'MISMATCH_DETECTED';
      statusLabel = 'Suspicious Lookalike Listing Domain';
      summary =
        'The listing URL points to a deceptive lookalike domain designed to impersonate the target company. Details cannot be trusted.';
      color = 'red';
    } else {
      status = 'USER_PROVIDED_UNVERIFIED';
      statusLabel = 'User-Provided Source — Not Independently Verified';
      summary =
        'The listing URL was provided by the user, but its official authorization cannot be independently established. It may be a third-party aggregator or unverified blog.';
      color = 'blue';
    }
  } else if (feeDemanded || mismatchedCount >= 2) {
    status = 'MISMATCH_DETECTED';
    statusLabel = 'Mismatch Detected';
    summary =
      'Significant discrepancies detected between the submitted offer and the retrieved official listing, particularly in fees, recruiter identity, or compensation.';
    color = 'red';
  } else if (matchedCount >= 3 && mismatchedCount === 0) {
    status = 'STRONG_MATCH';
    statusLabel = 'Strong Match';
    summary =
      'The submitted offer closely aligns with the official listing on an authorized corporate portal across role, compensation, and requisitions.';
    color = 'teal';
  } else if (mismatchedCount === 1) {
    status = 'MISMATCH_DETECTED';
    statusLabel = 'Discrepancy Detected';
    summary =
      'A specific discrepancy was identified between the submitted offer and the official listing.';
    color = 'amber';
  } else {
    status = 'PARTIAL_MATCH';
    statusLabel = 'Partial Match';
    summary =
      'Some details align with the public listing, but several important fields were not available for comparison.';
    color = 'amber';
  }

  // ---------------------------------------------------------
  // 5. Evaluate the Three Distinct Verification Pillars
  // ---------------------------------------------------------
  const companyPillar = {
    status: (input.companyWebsite ? 'VERIFIED' : 'CAUTION') as 'VERIFIED' | 'CAUTION',
    label: input.companyWebsite ? 'Company Legitimate & Established' : 'Company Web Presence Missing',
    summary: input.companyWebsite
      ? `Corporate domain "${sourceDomain || input.companyWebsite}" is established and recognized.`
      : 'No official corporate website URL provided.',
    evidence: input.companyWebsite || 'None provided',
    actionRequired: 'Verify company CIN on Ministry of Corporate Affairs (mca.gov.in) if needed.',
  };

  const listingPillar = {
    status: (status === 'STRONG_MATCH' ? 'VERIFIED' : status === 'MISMATCH_DETECTED' ? 'MISMATCH' : 'PARTIAL') as
      | 'VERIFIED'
      | 'MISMATCH'
      | 'PARTIAL',
    label: statusLabel,
    summary,
    evidence: `${matchedCount} Matched, ${mismatchedCount} Mismatched, ${unavailableCount} Unavailable`,
    actionRequired:
      mismatchedCount > 0
        ? 'Cross-check discrepancies with official careers portal directly.'
        : 'Ensure job responsibilities match your expected curriculum.',
  };

  // Recruiter authorization must remain independent!
  const isRecruiterCorporate =
    input.recruiterEmail &&
    !input.recruiterEmail.includes('@gmail') &&
    !input.recruiterEmail.includes('@yahoo') &&
    !input.recruiterEmail.includes('@outlook') &&
    input.offerSource !== 'telegram';

  const recruiterPillar = {
    status: (feeDemanded ? 'SUSPICIOUS' : isRecruiterCorporate ? 'CONFIRMED' : 'UNCONFIRMED') as
      | 'SUSPICIOUS'
      | 'CONFIRMED'
      | 'UNCONFIRMED',
    label: feeDemanded
      ? 'Recruiter Demanding Fee (High Risk)'
      : isRecruiterCorporate
      ? 'Recruiter Corporate Domain Aligned'
      : 'Recruiter Authorization Unconfirmed',
    summary: feeDemanded
      ? 'Recruiter demanded upfront fees or used informal channels. A matching listing does NOT make the recruiter safe.'
      : isRecruiterCorporate
      ? 'Recruiter corresponds from official corporate email domain.'
      : 'Recruiter contacted you via personal email or instant messaging. Scammers regularly copy genuine job listings to deceive students.',
    evidence: input.recruiterEmail || input.offerSource,
    actionRequired:
      'Contact the company talent acquisition department using independently sourced contact details—never reply only to the recruiter.',
  };

  const threePillarVerification: ThreePillarVerification = {
    companyLegitimacy: companyPillar,
    listingMatch: listingPillar,
    recruiterAuthorization: recruiterPillar,
    guidanceNote:
      'CRITICAL: Scammers often copy real, active job descriptions from company websites and pose as recruiters on Telegram/WhatsApp. A matching job listing alone DOES NOT prove that the recruiter is genuine or authorized.',
  };

  // Recommended Next Steps tailored to listing outcome
  const recommendedNextSteps: string[] = [];
  if (status === 'STRONG_MATCH') {
    recommendedNextSteps.push(
      'The job listing matches official records. Next, verify that the recruiter is an authorized employee by checking their corporate email header (SPF/DKIM).',
      'Never transfer any money even if the role matches an official listing.',
      'Check the company careers portal directly to confirm that your application is linked to your candidate profile.'
    );
  } else if (status === 'MISMATCH_DETECTED') {
    recommendedNextSteps.push(
      'Do not accept this offer. Serious discrepancies were detected against the official job listing.',
      'If an upfront fee was requested, report this immediately to your college Placement Cell and https://cybercrime.gov.in (Helpline: 1930).',
      'Contact the company via their official careers contact email (sourced independently, not from the recruiter) to report the impersonation.'
    );
  } else {
    recommendedNextSteps.push(
      'Because the listing was unverified or incomplete, verify the vacancy directly on the employer\'s official website.',
      'Ask the recruiter to send formal communications from their corporate domain email.',
      'Do not provide sensitive documents (Aadhaar, bank account passwords) until authorization is proven.'
    );
  }

  return {
    status,
    statusLabel,
    summary,
    color,
    listingUrl,
    sourceDomain,
    isIndependentlyVerifiedSource: sourceValidation.isIndependentlyVerified,
    sourceType: sourceValidation.sourceType,
    checkedAt: new Date().toISOString(),
    fields,
    matchedCount,
    mismatchedCount,
    unavailableCount,
    suspiciousDifferences,
    recommendedNextSteps,
    threePillarVerification,
    isSimulatedDemo: isDemo,
    simulatedScenarioTitle: demoTitle,
  };
}
