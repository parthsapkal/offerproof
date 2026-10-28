'use client';

import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenGuide: () => void;
  onScrollToTop: () => void;
}

export function Footer({ onOpenGuide, onScrollToTop }: FooterProps) {
  return (
    <footer className="bg-surface text-muted border-t border-neutral-border text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <button
              onClick={onScrollToTop}
              className="flex items-center space-x-2 text-charcoal text-left focus:outline-none"
            >
              <div className="w-7 h-7 rounded-md bg-sage text-forest flex items-center justify-center border border-sage-border">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-charcoal">
                Offer<span className="text-forest">Proof</span>
              </span>
            </button>
            <p className="text-muted text-xs max-w-sm leading-relaxed">
              Verify before you accept. An India-focused internship offer verification assistant helping students detect recruitment fraud, lookalike domains, and unauthorized payment requests.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-forest font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-forest" />
              <span>Independent Verification Assistant for Indian Students</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-charcoal font-semibold text-xs uppercase tracking-wider">
              Verification Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenGuide}
                  className="hover:text-charcoal transition text-left"
                >
                  Student Safety Guide & Red Flags
                </button>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-charcoal transition inline-flex items-center space-x-1"
                >
                  <span>National Cyber Crime Portal</span>
                  <ExternalLink className="w-3 h-3 text-muted" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mca.gov.in/mcafoportal/checkCompanyName.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-charcoal transition inline-flex items-center space-x-1"
                >
                  <span>MCA Corporate Search (CIN)</span>
                  <ExternalLink className="w-3 h-3 text-muted" />
                </a>
              </li>
              <li>
                <a
                  href="https://internship.aicte-india.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-charcoal transition inline-flex items-center space-x-1"
                >
                  <span>AICTE Internship Portal</span>
                  <ExternalLink className="w-3 h-3 text-muted" />
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline */}
          <div className="space-y-2.5">
            <h4 className="text-charcoal font-semibold text-xs uppercase tracking-wider">
              Emergency Assistance
            </h4>
            <div className="bg-warm border border-neutral-border p-3 rounded-lg space-y-1">
              <div className="flex items-center space-x-1.5 text-danger font-semibold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1930 (Toll-Free)</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                Ministry of Home Affairs Cyber Crime Helpline. Call immediately within golden hours if you transferred funds to a fraudulent recruiter.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-neutral-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted">
          <p className="max-w-2xl text-center sm:text-left leading-relaxed">
            Disclaimer: OfferProof executes deterministic verification heuristics to identify documented scam indicators. It is an independent verification tool and does not provide legal representation. Always confirm with your college placement cell and verified corporate channels.
          </p>
          <p className="shrink-0">
            &copy; {new Date().getFullYear()} OfferProof.
          </p>
        </div>
      </div>
    </footer>
  );
}
