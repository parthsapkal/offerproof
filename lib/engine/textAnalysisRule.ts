import { Finding, OfferInput } from '../types';

const PRESSURE_TACTICS_REGEX = /(valid (only )?for \d+\s*(hours?|mins?|minutes?)|pay within \d+\s*(hours?|mins?|minutes?)|immediate (action|payment|booking)|limited (seats?|slots?)|slot(s)? will be cancelled|seat confirmation deadline|within 24 hours|within 12 hours|immediate confirmation required)/i;

const LEGAL_THREATS_REGEX = /(legal notice|police complaint|court action|ipc section|breach of contract|penalty of rs|fine of rs|legal action will be taken|advocate notice)/i;

const UNREALISTIC_WORK_REGEX = /(copy paste|form filling|captcha solving|data typing|like (and|&) subscribe|youtube video rating|review products|no interview (needed|required)|direct selection without interview|no technical skills? required)/i;

const EXCESSIVE_STIPEND_SIMPLE_ROLE_REGEX = /(data entry|typing|form filling|back office).{0,60}(\u20B9|rs\.?|inr)\s*([3-9]\d{4}|\d{6})/i;

const CREDENTIAL_HARVESTING_REGEX = /(bank otp|atm card photo|debit card cvv|netbanking password|upi pin|blank (signed )?cheque)/i;

const INTERVIEW_EVIDENCE_REGEX = /(technical (round|interview)|coding assessment|system design|managerial round|hr interview|panel interview|assignment evaluation|screening call)/i;

export function checkTextAnalysisRules(input: OfferInput): Finding[] {
  const findings: Finding[] = [];
  const text = `${input.pastedText || ''} ${input.documentExtractedText || ''}`;

  if (!text.trim()) {
    return findings;
  }

  // 1. Check for extreme urgency / pressure tactics
  if (PRESSURE_TACTICS_REGEX.test(text)) {
    const match = text.match(PRESSURE_TACTICS_REGEX);
    findings.push({
      id: 'TACTIC_HIGH_PRESSURE_URGENCY',
      category: 'CONTENT_TACTICS',
      severity: 'WARNING',
      title: 'High-Pressure Urgency Tactics Detected',
      evidence: `Text exhibits artificial urgency: "${match ? match[0] : 'immediate deadline'}"`,
      explanation:
        'Fraudulent recruiters create artificial countdowns and tight deadlines to induce panic and rush students into transferring money or signing agreements without consulting mentors or parents.',
      recommendedAction:
        'Slow down and do not rush. Legitimate organizations give candidates ample time (typically 3 to 7 business days) to review and accept offer terms.',
    });
  }

  // 2. Check for coercive threats / bogus legal intimidation
  if (LEGAL_THREATS_REGEX.test(text)) {
    const match = text.match(LEGAL_THREATS_REGEX);
    findings.push({
      id: 'TACTIC_LEGAL_INTIMIDATION',
      category: 'CONTENT_TACTICS',
      severity: 'CRITICAL',
      title: 'Coercive Threats of Legal Action / Fake IPC Notices',
      evidence: `Communication contains intimidation language: "${match ? match[0] : 'legal notice/action'}".`,
      explanation:
        'In classic Indian data-entry and typing scams, scammers threaten victims with fake legal notices or police action if they refuse to pay "breach fees" or "cancellation charges". These threats are fabricated extortion tactics with zero legal validity.',
      recommendedAction:
        'Do not be intimidated. Do not pay any fine or penalty. Consult your college legal aid cell or contact the cybercrime helpline (1930) to report harassment and extortion.',
    });
  }

  // 3. Unrealistic promises & typing / review scams
  if (UNREALISTIC_WORK_REGEX.test(text)) {
    const match = text.match(UNREALISTIC_WORK_REGEX);
    findings.push({
      id: 'TACTIC_UNREALISTIC_ROLE',
      category: 'CONTENT_TACTICS',
      severity: 'WARNING',
      title: 'High-Risk Task Pattern (Copy-Paste / Data Typing / Review Tasks)',
      evidence: `Role description highlights: "${match ? match[0] : 'no interview / simple task'}"`,
      explanation:
        'Offers promising substantial pay for basic copy-pasting, captcha solving, or reviewing products with "no interview required" are signature formats for advance-fee scams and deceptive task fraud.',
      recommendedAction:
        'Avoid roles that bypass interview evaluations or require mechanical tasks like page typing. These almost invariably withhold payouts and demand "error penalty" fees.',
    });
  }

  // 4. Excessive stipend for simple roles
  if (EXCESSIVE_STIPEND_SIMPLE_ROLE_REGEX.test(text)) {
    findings.push({
      id: 'TACTIC_INFLATED_STIPEND',
      category: 'CONTENT_TACTICS',
      severity: 'WARNING',
      title: 'Disproportionately High Stipend for Entry-Level Administrative Tasks',
      evidence: 'Stipend promises exceed standard Indian market benchmarks for basic administrative or entry data roles.',
      explanation:
        'Unusually lucrative pay for low-complexity student roles is commonly dangled as bait to attract large volumes of applicants before requesting "security deposits" or "training fees".',
      recommendedAction:
        'Benchmark compensation against Indian market norms (e.g. AmbitionBox, Glassdoor, Internshala reports). If it sounds too good to be true, proceed with extreme caution.',
    });
  }

  // 5. Credential harvesting / Banking fraud
  if (CREDENTIAL_HARVESTING_REGEX.test(text)) {
    const match = text.match(CREDENTIAL_HARVESTING_REGEX);
    findings.push({
      id: 'TACTIC_CREDENTIAL_HARVESTING',
      category: 'CONTENT_TACTICS',
      severity: 'CRITICAL',
      title: 'Sensitive Financial Information Solicited',
      evidence: `Communication requests sensitive credentials: "${match ? match[0] : 'banking credentials/cheques'}"`,
      explanation:
        'Employers only require a Bank Account Number and IFSC code for salary NEFT credits. Any request for OTPs, ATM cards, UPI PINs, or blank cheques is direct financial fraud.',
      recommendedAction:
        'Never disclose your OTP, UPI PIN, or ATM card photos to anyone. Immediately inform your bank to lock your account if already shared.',
    });
  }

  // 6. Interview rigor evidence (Positive indicator)
  if (INTERVIEW_EVIDENCE_REGEX.test(text)) {
    findings.push({
      id: 'EVIDENCE_FORMAL_INTERVIEW_PROCESS',
      category: 'CONTENT_TACTICS',
      severity: 'VERIFIED',
      title: 'Formal Evaluation & Multi-Round Assessment Referenced',
      evidence: 'Documentation references structured evaluation stages (technical interview, assessment, or panel reviews).',
      explanation:
        'Legitimate internship offers follow an evaluative interview process evaluating applicant suitability. Scams rarely conduct genuine technical or structured interviews.',
      recommendedAction:
        'Ensure you actually participated in the specific interview rounds stated in the letter.',
    });
  }

  return findings;
}
