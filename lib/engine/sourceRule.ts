import { Finding, OfferInput } from '../types';

export function checkOfferSourceRule(input: OfferInput): Finding[] {
  const findings: Finding[] = [];
  const source = (input.offerSource || '').toLowerCase().trim();
  const combinedText = `${input.pastedText || ''} ${input.documentExtractedText || ''}`.toLowerCase();

  // Check if text suggests off-platform migration (e.g. "contact HR on Telegram / WhatsApp")
  const migratesToTelegram = combinedText.includes('telegram') || combinedText.includes('t.me/');
  const migratesToWhatsapp = combinedText.includes('whatsapp') || combinedText.includes('wa.me/');

  if (source === 'telegram' || migratesToTelegram) {
    findings.push({
      id: 'SOURCE_TELEGRAM_HIGH_RISK',
      category: 'COMMUNICATION_CHANNEL',
      severity: 'WARNING',
      title: 'High-Risk Communication Channel: Telegram',
      evidence:
        source === 'telegram'
          ? 'Offer originated via Telegram messaging or Telegram channel.'
          : 'Offer text instructs candidate to contact recruiter/HR via Telegram.',
      explanation:
        'Telegram provides near-complete anonymity and is the primary vector for pre-recruitment task fraud, data-entry scams, and fictitious crypto/prepaid tasks targeting Indian students. Formal corporate recruiters do not conduct internship onboarding exclusively over Telegram.',
      recommendedAction:
        'Cease engagement on Telegram. Never perform "prepaid tasks", review submission tasks, or transfer funds. Insist on formal communication through verifiable corporate channels.',
    });
  }

  if (source === 'whatsapp' || (migratesToWhatsapp && source !== 'campus')) {
    findings.push({
      id: 'SOURCE_WHATSAPP_UNVERIFIED',
      category: 'COMMUNICATION_CHANNEL',
      severity: 'CAUTION',
      title: 'Informal Messaging Channel: WhatsApp',
      evidence:
        source === 'whatsapp'
          ? 'Offer originated via WhatsApp messaging.'
          : 'Communication instructs candidate to coordinate primarily on WhatsApp.',
      explanation:
        'While some startup recruiters coordinate logistics via WhatsApp, genuine hiring workflows in India always maintain formal written trails via official corporate email addresses and authenticated job portals.',
      recommendedAction:
        'Ask the sender to email you from their official corporate domain address. Verify the international dial code (watch out for international numbers like +1, +44, +234, +62 pretending to be Indian recruiters).',
    });
  }

  if (source === 'social_media') {
    findings.push({
      id: 'SOURCE_SOCIAL_MEDIA_AD',
      category: 'COMMUNICATION_CHANNEL',
      severity: 'WARNING',
      title: 'Unverified Social Media Advertisement / Direct Message',
      evidence: 'Internship opportunity sourced from Instagram, Facebook, or other social media feeds.',
      explanation:
        'A large volume of student fraudulent schemes run sponsored advertisements on social media promising flexible high-paying remote roles, often funneling applicants to unauthorized third-party landing pages.',
      recommendedAction:
        'Verify whether the sponsoring company has a verified corporate page and check their official career site before submitting personal identity documents.',
    });
  }

  if (source === 'campus') {
    findings.push({
      id: 'SOURCE_CAMPUS_PLACEMENT_CELL',
      category: 'COMMUNICATION_CHANNEL',
      severity: 'VERIFIED',
      title: 'Coordinated via Official Campus Placement Cell (TPO)',
      evidence: 'Offer sourced through official college placement cell / Training and Placement Office.',
      explanation:
        'Institutional campus placement drives involve prior vetting of employers by college authorities, substantially reducing identity fraud and fee extortion risks.',
      recommendedAction:
        'Verify with your college TPO coordinator that this specific offer letter and compensation terms match the campus drive records.',
    });
  }

  if (source === 'internshala') {
    findings.push({
      id: 'SOURCE_INTERNSHALA_PORTAL',
      category: 'COMMUNICATION_CHANNEL',
      severity: 'VERIFIED',
      title: 'Applied Through Verified Student Internship Portal',
      evidence: 'Offer originated through an application on Internshala.',
      explanation:
        'Platforms like Internshala enforce anti-fee rules and employer verification, though candidates should ensure the employer does not solicit off-platform fees after initial contact.',
      recommendedAction:
        'Keep all messaging inside the portal. If the employer requests money or asks you to shift conversation to Telegram, report them immediately using the in-portal report tool.',
    });
  }

  return findings;
}
