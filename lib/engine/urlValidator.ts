/**
 * SSRF Protection & URL Validation for OfferProof
 * Ensures that server-side listing fetches never access private, internal, or cloud metadata endpoints.
 */

const PRIVATE_IP_PATTERNS = [
  /^127\./,                         // Loopback (127.0.0.0/8)
  /^10\./,                          // Private class A (10.0.0.0/8)
  /^172\.(1[6-9]|2\d|3[0-1])\./,    // Private class B (172.16.0.0/12)
  /^192\.168\./,                    // Private class C (192.168.0.0/16)
  /^169\.254\./,                    // Link-local / Cloud metadata (169.254.0.0/16)
  /^0\.0\.0\.0$/,                   // Wildcard local
  /^255\.255\.255\.255$/,           // Broadcast
  /^::1$/,                          // IPv6 Loopback
  /^fe80:/i,                        // IPv6 Link-local
  /^fc00:/i,                        // IPv6 Unique local
  /^fd00:/i,                        // IPv6 Unique local
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'broadcasthost',
  'metadata.google.internal',
  '169.254.169.254',
  'instance-data',
]);

const BLOCKED_EXTENSIONS = [
  '.local',
  '.internal',
  '.intranet',
  '.corp',
  '.home',
  '.lan',
];

export interface ValidatedUrlResult {
  isValid: boolean;
  normalizedUrl?: string;
  hostname?: string;
  error?: string;
}

export function validateListingUrl(rawUrl: string): ValidatedUrlResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'No URL provided' };
  }

  let trimmed = rawUrl.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: 'Malformed URL syntax' };
  }

  // Only allow standard http and https protocols
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isValid: false,
      error: `Unsupported protocol "${parsed.protocol}". Only HTTP and HTTPS are permitted.`,
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Check blocked hostnames
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return {
      isValid: false,
      error: 'Security Policy: Access to local/private network addresses is blocked (SSRF Protection).',
    };
  }

  // Check blocked suffix extensions
  for (const ext of BLOCKED_EXTENSIONS) {
    if (hostname.endsWith(ext)) {
      return {
        isValid: false,
        error: `Security Policy: Access to internal network domain "${hostname}" is prohibited.`,
      };
    }
  }

  // Check for IP-based targets
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return {
        isValid: false,
        error: 'Security Policy: Private, loopback, or cloud-metadata IP addresses cannot be accessed.',
      };
    }
  }

  // Disallow non-standard ports (e.g. 22, 25, 3306, 6379, 8080) for SSRF protection
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return {
      isValid: false,
      error: `Security Policy: Non-standard web port "${parsed.port}" is not permitted for official listing verification.`,
    };
  }

  // Clean trailing hash fragments and analytics parameters
  parsed.hash = '';
  // Clean common tracking query params
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'].forEach(
    (param) => parsed.searchParams.delete(param)
  );

  return {
    isValid: true,
    normalizedUrl: parsed.toString(),
    hostname,
  };
}
