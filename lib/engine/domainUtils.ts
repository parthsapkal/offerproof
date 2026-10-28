/**
 * Domain & URL utilities for OfferProof verification engine
 */

export const PUBLIC_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'rediffmail.com',
  'rediff.com',
  'zoho.com',
  'yandex.com',
  'mail.com',
  'gmx.com',
  'aol.com',
]);

export const FREE_HOSTING_DOMAINS = [
  'weebly.com',
  'wixsite.com',
  'blogspot.com',
  'wordpress.com',
  'sites.google.com',
  'carrd.co',
  'webflow.io',
  'vercel.app',
  'pages.dev',
  'github.io',
  'netlify.app',
];

export const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'cutt.ly',
  'is.gd',
  'rb.gy',
  'shorturl.at',
  'wa.me',
  't.me',
];

export const KNOWN_INDIAN_TECH_ENTERPRISES: Record<string, string[]> = {
  tcs: ['tcs.com', 'tataconsultancy.com'],
  infosys: ['infosys.com'],
  wipro: ['wipro.com'],
  hcl: ['hcltech.com', 'hcl.com'],
  cognizant: ['cognizant.com'],
  techmahindra: ['techmahindra.com', 'techm.com'],
  accenture: ['accenture.com'],
  microsoft: ['microsoft.com'],
  google: ['google.com'],
  amazon: ['amazon.com', 'amazon.jobs', 'amazon.in'],
  flipkart: ['flipkart.com'],
  razorpay: ['razorpay.com'],
  swiggy: ['swiggy.in', 'swiggy.com'],
  zomato: ['zomato.com'],
  paytm: ['paytm.com', 'one97.com'],
  cred: ['cred.club'],
  zerodha: ['zerodha.com'],
};

/**
 * Extracts normalized hostname from an input string (website or URL)
 */
export function extractHostname(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  let trimmed = rawUrl.trim().toLowerCase();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    let host = parsed.hostname.toLowerCase();
    if (host.startsWith('www.')) {
      host = host.slice(4);
    }
    return host;
  } catch {
    // Fallback regex extraction
    const match = rawUrl.toLowerCase().match(/(?:https?:\/\/)?(?:www\.)?([a-z0-9.-]+\.[a-z]{2,})/i);
    return match ? match[1] : null;
  }
}

/**
 * Extracts apex domain (e.g. careers.razorpay.com -> razorpay.com)
 */
export function extractApexDomain(host: string): string {
  if (!host) return '';
  const parts = host.split('.');
  if (parts.length <= 2) return host;

  // Handle common compound TLDs like .co.in, .com.au, .gov.in, .org.in
  const lastTwo = parts.slice(-2).join('.');
  const compoundTLDs = ['co.in', 'gov.in', 'org.in', 'net.in', 'ac.in', 'edu.in', 'com.au', 'co.uk'];
  if (compoundTLDs.includes(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

/**
 * Extracts domain part from an email address
 */
export function extractEmailDomain(email: string): string | null {
  if (!email || typeof email !== 'string') return null;
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length === 2 && parts[1]) {
    return parts[1];
  }
  return null;
}

/**
 * Checks if domain is a known public free email provider
 */
export function isPublicEmailDomain(domain: string): boolean {
  if (!domain) return false;
  return PUBLIC_EMAIL_DOMAINS.has(domain.toLowerCase());
}

/**
 * Detects lookalike patterns or suspicious domain keywords
 */
export function detectLookalikeSuspicion(
  emailDomain: string,
  companyWebsiteDomain: string | null,
  companyName: string
): { isSuspicious: boolean; reason?: string } {
  const normEmailDomain = emailDomain.toLowerCase();

  // Check free hosting platforms
  for (const freeHost of FREE_HOSTING_DOMAINS) {
    if (normEmailDomain.endsWith(freeHost)) {
      return {
        isSuspicious: true,
        reason: `Email domain uses a free web builder/hosting domain (${freeHost}) rather than an authenticated corporate domain.`,
      };
    }
  }

  // Keywords that scammers frequently attach to legitimate company names
  const scamKeywordPatterns = [
    '-career',
    '-careers',
    '-jobs',
    '-hiring',
    '-recruitment',
    '-interview',
    '-hr',
    '-india',
    '-intern',
    '-internship',
    '-portal',
    '-placement',
    '-team',
  ];

  const cleanCompanyName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const kw of scamKeywordPatterns) {
    if (normEmailDomain.includes(kw)) {
      // If company website doesn't contain this keyword, it's very likely a lookalike domain
      if (companyWebsiteDomain && !companyWebsiteDomain.includes(kw)) {
        return {
          isSuspicious: true,
          reason: `The recruiter's domain contains deceptive hiring keywords ("${kw}") commonly registered by scammers impersonating organizations (e.g. ${normEmailDomain}).`,
        };
      }
    }
  }

  // Check known tech enterprise impersonation
  for (const [corpKey, legitDomains] of Object.entries(KNOWN_INDIAN_TECH_ENTERPRISES)) {
    if (cleanCompanyName.includes(corpKey)) {
      const isLegit = legitDomains.some(
        (legit) => normEmailDomain === legit || normEmailDomain.endsWith('.' + legit)
      );
      if (!isLegit) {
        return {
          isSuspicious: true,
          reason: `The claimed company matches prominent Indian enterprise "${corpKey.toUpperCase()}", but the recruiter email domain "${normEmailDomain}" does not belong to the authorized domain list (${legitDomains.join(', ')}).`,
        };
      }
    }
  }

  return { isSuspicious: false };
}
