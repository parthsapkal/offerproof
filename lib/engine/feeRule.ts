import { Finding, OfferInput } from '../types';

const FEE_KEYWORDS_REGEX = /(registration fee|processing fee|security deposit|laptop deposit|training (cost|fee|charge)|certification fee|onboarding fee|kit charges|document verification fee|courier charge|refundable deposit|caution deposit|seat confirmation fee|uniform fee|pay \u20B9|rs\.?\s*\d+|inr\s*\d+|send (money|payment|fees))/i;

const ANTI_FEE_DISCLAIMER_REGEX = /(does not|do not|never|will not|without any|strictly does not)\s*(charge|ask for|require|demand|collect|take|accept)?\s*(any)?\s*(registration|processing|application|equipment|training|onboarding)?\s*(fee|deposit|money|payment|charge)/i;

const PAYMENT_METHODS_REGEX = /(upi|gpay|google pay|phonepe|paytm|qr code|neft|imps|account transfer)/i;

/**
 * Checks for any upfront fee, deposit, or monetary demand.
 * This is the #1 warning sign in Indian student internship fraud.
 */
export function checkFeeRule(input: OfferInput): Finding[] {
  const findings: Finding[] = [];
  const combinedText = `${input.pastedText || ''} ${input.documentExtractedText || ''}`;

  const hasExplicitFee = input.feeRequested && (input.feeAmount !== undefined && input.feeAmount !== null && input.feeAmount > 0);
  const isAntiFeeDisclaimer = ANTI_FEE_DISCLAIMER_REGEX.test(combinedText);
  const textMatchesFee = !isAntiFeeDisclaimer && FEE_KEYWORDS_REGEX.test(combinedText);
  const textMatchesPaymentMethod = PAYMENT_METHODS_REGEX.test(combinedText);

  if (hasExplicitFee || (input.feeRequested && input.feeReason)) {
    const amountStr = input.feeAmount ? `\u20B9${input.feeAmount.toLocaleString('en-IN')}` : 'an unspecified sum';
    const reasonStr = input.feeReason ? ` for "${input.feeReason}"` : '';

    findings.push({
      id: 'FEE_DEMAND_CRITICAL',
      category: 'FEE',
      severity: 'CRITICAL',
      title: 'Upfront Payment Demanded for Internship',
      evidence: `The offer explicitly requests ${amountStr}${reasonStr}.`,
      explanation:
        'Under AICTE internship norms and standard Indian corporate hiring practices, genuine employers never charge candidates for recruitment, training, laptop couriers, or onboarding. This is the single highest indicator of student recruitment scams in India.',
      recommendedAction:
        'DO NOT TRANSFER ANY MONEY via UPI, NetBanking, or QR code. Cease communication immediately. Report this recruiter to your college Placement Cell / TPO and file an incident report at cybercrime.gov.in or dial 1930.',
    });
  } else if (textMatchesFee) {
    const match = combinedText.match(FEE_KEYWORDS_REGEX);
    const matchedPhrase = match ? match[0] : 'payment or deposit';

    findings.push({
      id: 'FEE_MENTION_IN_TEXT',
      category: 'FEE',
      severity: 'CRITICAL',
      title: 'Monetary Fee or Deposit Detected in Offer Documentation',
      evidence: `Found suspicious fee-related phrasing: "${matchedPhrase}" in the submitted text or letter.`,
      explanation:
        'The submitted offer letter or communication contains references to financial fees or deposits. Fraudulent schemes often disguise fees as "refundable security deposits" or "training materials".',
      recommendedAction:
        'Do not make any upfront payments. Ask the recruiter in writing whether any payment is mandatory; if they confirm, report the sender immediately.',
    });
  } else if (isAntiFeeDisclaimer && !input.feeRequested) {
    // Explicit positive corporate integrity disclaimer
    findings.push({
      id: 'EXPLICIT_ANTI_FEE_INTEGRITY_NOTICE',
      category: 'FEE',
      severity: 'VERIFIED',
      title: 'Explicit Corporate Anti-Fee Policy Stated',
      evidence: 'Offer letter explicitly includes standard corporate policy confirming zero recruitment or deposit fees.',
      explanation:
        'Established organizations in India routinely include clear warnings stating that the company does not charge any application, registration, or equipment deposit fees.',
      recommendedAction:
        'Continue standard onboarding procedures through authenticated official company channels.',
    });
  } else {
    // Positive indicator
    findings.push({
      id: 'NO_FEE_DEMANDED',
      category: 'FEE',
      severity: 'VERIFIED',
      title: 'No Upfront Fee or Deposit Demanded',
      evidence: 'Zero registration, equipment deposit, or training fees reported or detected in offer text.',
      explanation:
        'Legitimate internships provide stipends or experience without charging candidates. The absence of fee demands is consistent with standard corporate hiring protocols.',
      recommendedAction:
        'Continue to remain vigilant. Ensure no hidden fees or "courier charges" are introduced at a later stage of onboarding.',
    });
  }

  // Check for UPI / QR Code mentions specifically
  if (textMatchesPaymentMethod && (hasExplicitFee || textMatchesFee)) {
    findings.push({
      id: 'UPI_QR_PAYMENT_REQUEST',
      category: 'FEE',
      severity: 'CRITICAL',
      title: 'Informal Payment Channel Requested (UPI / QR Code / Personal Wallets)',
      evidence: 'Found references to instant peer-to-peer payment methods (UPI, GPay, PhonePe, or QR Code) in connection with the offer.',
      explanation:
        'Corporate organizations in India process financial transactions through registered corporate bank accounts with GST invoicing, never direct UPI IDs to personal phone numbers or unverified VPA handles.',
      recommendedAction:
        'Never scan personal QR codes or send UPI payments to recruiter phone numbers. This is a common method used by cyber-criminals to evade banking traceability.',
    });
  }

  return findings;
}
