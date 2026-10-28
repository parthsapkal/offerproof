import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OfferProof | India-Focused Internship Offer Verification Assistant',
  description:
    'Verify before you accept. Protect Indian college students from fake internship offers, upfront registration fees, lookalike domains, and recruitment scams with deterministic rules.',
  keywords: [
    'internship offer verification',
    'internship scam detector',
    'AICTE fake internship warning',
    'Indian student job safety',
    'registration fee scam',
    'domain spoofing check',
  ],
  authors: [{ name: 'OfferProof Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col font-sans antialiased text-navy-950 bg-slate-50 selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
