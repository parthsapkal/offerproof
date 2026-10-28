'use client';

import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onOpenGuide: () => void;
  onScrollToTop: () => void;
}

export function Footer({ onOpenGuide, onScrollToTop }: FooterProps) {
  return (
    <footer className="bg-navy-950 text-navy-400 border-t border-navy-800 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white cursor-pointer" onClick={onScrollToTop}>
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-navy-950 font-black">
                <ShieldCheck className="w-5 h-5 text-navy-950" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Offer<span className="text-teal-400">Proof</span>
              </span>
            </div>
            <p className="text-navy-300 text-sm max-w-sm leading-relaxed">
              Verify before you accept. An India-focused internship offer verification assistant helping students detect recruitment fraud, domain lookalikes, and illegal fee extortion.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-teal-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Built for Indian Students & Placement Cells</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Verification Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenGuide} className="hover:text-teal-300 transition text-left">
                  Student Safety Guide & Red Flags
                </button>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 transition inline-flex items-center space-x-1"
                >
                  <span>National Cyber Crime Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mca.gov.in/mcafoportal/checkCompanyName.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 transition inline-flex items-center space-x-1"
                >
                  <span>MCA Corporate Search (CIN)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://internship.aicte-india.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 transition inline-flex items-center space-x-1"
                >
                  <span>AICTE Internship Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Victim Assistance Helpline
            </h4>
            <div className="bg-navy-900 border border-navy-800 p-3 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-1.5 text-red-400 font-bold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1930 (Toll-Free)</span>
              </div>
              <p className="text-[11px] text-navy-400 leading-snug">
                Ministry of Home Affairs Cyber Crime Emergency Line. Contact within golden hours if you have transferred funds.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-navy-500">
          <p className="max-w-xl text-center sm:text-left">
            Disclaimer: OfferProof executes deterministic verification heuristics to identify documented scam indicators. It is not a law enforcement agency or legal guarantee of corporate legitimacy. Always cross-verify directly with your college TPO and official company channels.
          </p>
          <p className="shrink-0">
            &copy; {new Date().getFullYear()} OfferProof. Open evaluation assistant.
          </p>
        </div>
      </div>
    </footer>
  );
}
