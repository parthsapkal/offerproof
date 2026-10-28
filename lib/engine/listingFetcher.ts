import { validateListingUrl } from './urlValidator';
import { DEMO_SCENARIOS, ParsedListingData } from '../demoScenarios';

export interface ListingFetchResult {
  data: ParsedListingData;
  isSimulatedDemo: boolean;
  simulatedScenarioTitle?: string;
  sourceDomain: string;
}

/**
 * Normalizes text extracted from HTML
 */
function cleanHtmlText(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Attempts to parse JSON-LD JobPosting schema from HTML
 */
function extractJsonLdJobPosting(html: string): Partial<ParsedListingData> | null {
  const jsonLdRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const content = match[1].trim();
      const parsed = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (
          item['@type'] === 'JobPosting' ||
          (Array.isArray(item['@type']) && item['@type'].includes('JobPosting'))
        ) {
          const title = typeof item.title === 'string' ? item.title : undefined;
          const company =
            typeof item.hiringOrganization === 'object' && item.hiringOrganization
              ? item.hiringOrganization.name
              : undefined;

          let location: string | undefined;
          if (item.jobLocation) {
            const loc = Array.isArray(item.jobLocation) ? item.jobLocation[0] : item.jobLocation;
            if (loc?.address) {
              const addr = loc.address;
              location = [addr.addressLocality, addr.addressRegion, addr.addressCountry]
                .filter(Boolean)
                .join(', ');
            }
          }
          if (item.jobLocationType === 'TELECOMMUTE') {
            location = location ? `${location} (Remote / Work from Home)` : 'Remote / Work from Home';
          }

          let compensation: string | undefined;
          if (item.baseSalary) {
            const sal = item.baseSalary.value;
            if (sal) {
              const unit = item.baseSalary.unitText || 'MONTH';
              const val = typeof sal === 'object' ? `${sal.minValue || ''}-${sal.maxValue || sal.value || ''}` : sal;
              compensation = `${item.baseSalary.currency || '\u20B9'} ${val} / ${unit.toLowerCase()}`;
            }
          }

          const jobId = typeof item.identifier === 'object' && item.identifier ? item.identifier.value : undefined;
          const applicationDeadline = typeof item.validThrough === 'string' ? item.validThrough : undefined;

          return {
            companyName: company,
            jobTitle: title,
            location,
            compensation,
            jobId,
            applicationDeadline,
          };
        }
      }
    } catch {
      // Continue searching
    }
  }

  return null;
}

/**
 * Retrieves public listing information.
 * Uses SSRF-safe HTTP fetching for live URLs, or loads realistic illustrative data for predefined demo scenarios.
 */
export async function fetchListingData(
  listingUrl: string,
  demoScenarioId?: string
): Promise<ListingFetchResult> {
  // 1. Check if a demo benchmark scenario was requested
  if (demoScenarioId && DEMO_SCENARIOS[demoScenarioId]) {
    const demo = DEMO_SCENARIOS[demoScenarioId];
    let host = '';
    try {
      host = new URL(demo.listingUrl).hostname;
    } catch {
      host = 'example.com';
    }

    return {
      data: demo.simulatedListing,
      isSimulatedDemo: true,
      simulatedScenarioTitle: demo.title,
      sourceDomain: host,
    };
  }

  // 2. No URL provided
  if (!listingUrl || !listingUrl.trim()) {
    return {
      data: { isAvailable: false, errorMessage: 'No listing URL supplied for comparison' },
      isSimulatedDemo: false,
      sourceDomain: '',
    };
  }

  // 3. Validate URL with SSRF protection
  const validated = validateListingUrl(listingUrl);
  if (!validated.isValid || !validated.normalizedUrl) {
    return {
      data: {
        isAvailable: false,
        errorMessage: validated.error || 'Invalid or blocked listing URL',
      },
      isSimulatedDemo: false,
      sourceDomain: validated.hostname || '',
    };
  }

  const targetUrl = validated.normalizedUrl;
  const hostname = validated.hostname || '';

  // 4. Perform SSRF-protected server-side HTTP fetch with strict timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (OfferProof Public Listing Verifier/1.0; +https://offerproof.internal)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (response.status === 404 || response.status === 410) {
      return {
        data: {
          isAvailable: false,
          httpStatus: response.status,
          errorMessage: `HTTP ${response.status}: The job listing page has expired, been unlisted, or does not exist.`,
        },
        isSimulatedDemo: false,
        sourceDomain: hostname,
      };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        data: {
          isAvailable: false,
          httpStatus: response.status,
          errorMessage: `HTTP ${response.status}: Access restricted by server (authentication, paywall, or anti-scraping protection active).`,
        },
        isSimulatedDemo: false,
        sourceDomain: hostname,
      };
    }

    if (!response.ok) {
      return {
        data: {
          isAvailable: false,
          httpStatus: response.status,
          errorMessage: `HTTP ${response.status}: Server returned error status ${response.statusText}.`,
        },
        isSimulatedDemo: false,
        sourceDomain: hostname,
      };
    }

    // Read response text (bounded to 500KB)
    const rawHtml = await response.text();
    const html = rawHtml.slice(0, 500000);

    // Parse structured JSON-LD first
    const jsonLd = extractJsonLdJobPosting(html);

    // Extract Meta and Headings as fallbacks
    let title: string | undefined = jsonLd?.jobTitle;
    let company: string | undefined = jsonLd?.companyName;
    let location: string | undefined = jsonLd?.location;
    let compensation: string | undefined = jsonLd?.compensation;
    let jobId: string | undefined = jsonLd?.jobId;
    let applicationDeadline: string | undefined = jsonLd?.applicationDeadline;

    if (!title) {
      const ogTitleMatch = html.match(/<meta\s+[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
      if (ogTitleMatch && ogTitleMatch[1]) {
        title = cleanHtmlText(ogTitleMatch[1]);
      } else {
        const titleTagMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        if (titleTagMatch && titleTagMatch[1]) {
          title = cleanHtmlText(titleTagMatch[1]);
        }
      }
    }

    if (!company) {
      const ogSiteName = html.match(/<meta\s+[^>]*property=["']og:site_name["'][^>]*content=["']([^"']*)["']/i);
      if (ogSiteName && ogSiteName[1]) {
        company = cleanHtmlText(ogSiteName[1]);
      }
    }

    // Check for payment mentions on the page
    let paymentRequirement = 'Not specified on public page';
    if (
      /(no (registration|application|recruitment|processing) fee|does not charge any fee|never asks for money|strictly free)/i.test(
        html
      )
    ) {
      paymentRequirement = 'Strictly \u20B90 (Explicit corporate zero-fee policy published on listing)';
    }

    return {
      data: {
        isAvailable: true,
        httpStatus: response.status,
        companyName: company,
        jobTitle: title,
        jobId,
        location,
        compensation,
        applicationDeadline,
        applicationChannel: targetUrl,
        paymentRequirement,
      },
      isSimulatedDemo: false,
      sourceDomain: hostname,
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.name === 'AbortError'
          ? 'Connection timed out after 6 seconds while reaching listing source'
          : err.message
        : 'Network failure while attempting to reach listing URL';

    return {
      data: {
        isAvailable: false,
        errorMessage: `Unable to verify live URL: ${errorMsg}`,
      },
      isSimulatedDemo: false,
      sourceDomain: hostname,
    };
  }
}
