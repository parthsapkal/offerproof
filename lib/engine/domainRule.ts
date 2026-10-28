import { Finding, OfferInput } from '../types';
import {
  detectLookalikeSuspicion,
  extractApexDomain,
  extractEmailDomain,
  extractHostname,
  isPublicEmailDomain,
  URL_SHORTENERS,
} from './domainUtils';

const RECOGNIZED_ATS_DOMAINS = [
  'greenhouse.io',
  'lever.co',
  'workday.com',
  'smartrecruiters.com',
  'darwinbox.in',
  'keka.com',
  'internshala.com',
  'naukri.com',
  'linkedin.com',
  'unstop.com',
  'wellfound.com',
  'foundit.in',
  'hirist.tech',
];

export function checkDomainAndEmailRules(input: OfferInput): Finding[] {
  const findings: Finding[] = [];

  const companyHost = extractHostname(input.companyWebsite || '');
  const companyApex = companyHost ? extractApexDomain(companyHost) : null;
  const emailDomain = extractEmailDomain(input.recruiterEmail || '');
  const listingHost = extractHostname(input.jobListingUrl || '');

  // 1. Recruiter Email Evaluation
  if (!input.recruiterEmail || !emailDomain) {
    findings.push({
      id: 'MISSING_RECRUITER_EMAIL',
      category: 'DOMAIN_EMAIL',
      severity: 'CAUTION',
      title: 'No Verifiable Recruiter Email Provided',
      evidence: 'The submission does not include a direct recruiter contact email address.',
      explanation:
        'Without a verifiable email address, it is impossible to validate whether communications originate from an authorized company domain.',
      recommendedAction:
        'Request an official email confirmation from the recruiter sent directly from their corporate domain (e.g. name@company.com), not an instant messaging handle.',
    });
  } else {
    // Check if free / public webmail
    if (isPublicEmailDomain(emailDomain)) {
      const isEstablishedCompany = Boolean(companyApex || input.companyName.trim().length > 3);
      findings.push({
        id: 'PUBLIC_FREE_EMAIL_DOMAIN',
        category: 'DOMAIN_EMAIL',
        severity: isEstablishedCompany ? 'WARNING' : 'CAUTION',
        title: `Public Webmail Address Used (@${emailDomain})`,
        evidence: `Recruiter is using a free public mail provider: "${input.recruiterEmail}".`,
        explanation:
          'Legitimate organizations and corporate HR departments send job offers through their authenticated corporate domains. Scammers heavily rely on free services like Gmail, Outlook, or Yahoo to pose as recruiters without authorization.',
        recommendedAction:
          'Treat this offer with caution. Contact the company directly through their official career portal or switchboard to verify whether the recruiter actually works there.',
      });
    } else {
      // It is a custom domain. Check lookalike suspicion
      const lookalike = detectLookalikeSuspicion(emailDomain, companyApex, input.companyName);
      if (lookalike.isSuspicious) {
        findings.push({
          id: 'LOOKALIKE_DOMAIN_DETECTED',
          category: 'DOMAIN_EMAIL',
          severity: 'CRITICAL',
          title: 'Suspicious Lookalike or Impersonation Domain Detected',
          evidence: `Recruiter email domain "@${emailDomain}" exhibits domain spoofing characteristics. ${lookalike.reason || ''}`,
          explanation:
            'Fraudsters regularly register lookalike domains containing terms like "-careers", "-india", or "-hiring" to impersonate legitimate brand names while deceiving student applicants.',
          recommendedAction:
            'Do not reply or share personal documents (Aadhaar, PAN, bank statements). Verify the domain WHOIS record or cross-check on the official company careers page.',
        });
      } else if (companyApex) {
        // Compare email apex with company apex
        const emailApex = extractApexDomain(emailDomain);
        if (emailApex === companyApex) {
          findings.push({
            id: 'MATCHING_CORPORATE_DOMAIN',
            category: 'DOMAIN_EMAIL',
            severity: 'VERIFIED',
            title: 'Recruiter Email Matches Official Company Domain',
            evidence: `Recruiter email (@${emailDomain}) matches claimed company domain (${companyApex}).`,
            explanation:
              'The recruiter email domain matches the official company web presence. Corporate email control requires domain ownership or DNS authorization.',
            recommendedAction:
              'Inspect incoming email headers (SPF, DKIM, DMARC) in your mail client to confirm the sender was not spoofed.',
          });
        } else {
          findings.push({
            id: 'DOMAIN_MISMATCH',
            category: 'DOMAIN_EMAIL',
            severity: 'WARNING',
            title: 'Recruiter Email Domain Mismatches Company Website',
            evidence: `Recruiter email domain "@${emailDomain}" does not match the company website domain "${companyApex}".`,
            explanation:
              'When hiring for an organization, recruiters almost always correspond from the company\'s primary domain or an authorized hiring subsidiary. Unrelated third-party domains pose impersonation risks.',
            recommendedAction:
              'Confirm whether the recruiting party is a formally contracted staffing agency, or reach out to the company via their official careers page to authenticate the representative.',
          });
        }
      }
    }
  }

  // 2. Company Website Evaluation
  if (!input.companyWebsite || !companyHost) {
    findings.push({
      id: 'MISSING_COMPANY_WEBSITE',
      category: 'DOMAIN_EMAIL',
      severity: 'CAUTION',
      title: 'Missing Company Website / Digital Presence',
      evidence: 'No valid company website URL was supplied with the verification request.',
      explanation:
        'Operating businesses in India have active web presences, corporate websites, or Ministry of Corporate Affairs (MCA) registration records. The absence of a company website impedes identity validation.',
      recommendedAction:
        'Search the Ministry of Corporate Affairs (MCA.gov.in) portal for the company\'s Corporate Identification Number (CIN) and verify the company\'s registered office address.',
    });
  } else {
    // Check for shorteners in company website
    for (const shortener of URL_SHORTENERS) {
      if (companyHost === shortener || companyHost.endsWith('.' + shortener)) {
        findings.push({
          id: 'SHORTENED_COMPANY_URL',
          category: 'DOMAIN_EMAIL',
          severity: 'WARNING',
          title: 'Shortened or Obfuscated URL Used for Company Website',
          evidence: `Submitted website uses URL redirect service (${companyHost}).`,
          explanation:
            'URL shorteners hide the true destination domain and are frequently used in phishing attacks to bypass security filters.',
          recommendedAction:
            'Do not follow shortened links. Inspect the actual destination URL before proceeding.',
        });
      }
    }
  }

  // 3. Job Listing URL Evaluation
  if (!input.jobListingUrl || !listingHost) {
    findings.push({
      id: 'MISSING_JOB_LISTING_URL',
      category: 'COMPLETENESS',
      severity: 'CAUTION',
      title: 'No Independent Job Listing URL Provided',
      evidence: 'No link to an active public job posting on an official career portal or recognized ATS was provided.',
      explanation:
        'Standard hiring workflows involve a verifiable public job opening on platforms such as LinkedIn, Internshala, Greenhouse, or the company\'s career page.',
      recommendedAction:
        'Ask the recruiter for the official career listing link to confirm this specific vacancy is officially open and budgeted.',
    });
  } else {
    // Check if listing host is a recognized ATS or matches company domain
    const isATS = RECOGNIZED_ATS_DOMAINS.some(
      (ats) => listingHost === ats || listingHost.endsWith('.' + ats)
    );
    const matchesCompany = companyApex && listingHost.includes(companyApex);

    if (isATS || matchesCompany) {
      findings.push({
        id: 'VERIFIABLE_JOB_LISTING',
        category: 'COMPLETENESS',
        severity: 'VERIFIED',
        title: 'Job Listing Hosted on Verifiable Domain / ATS',
        evidence: `Job listing URL points to legitimate source: "${listingHost}".`,
        explanation:
          'The internship opening is hosted either directly on the company\'s primary domain or through an enterprise Applicant Tracking System / verified student job board.',
        recommendedAction:
          'Compare the job title, stipend, and job responsibilities in the listing against your offer letter to ensure consistency.',
      });
    }
  }

  return findings;
}
