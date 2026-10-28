'use client';

import React from 'react';
import { ShieldCheck, PhoneCall, FileText, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onScrollToForm: () => void;
  onScrollToSamples: () => void;
}

export function Header({ onOpenGuide, onScrollToForm, onScrollToSamples }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-neutral-border text-charcoal transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={onScrollToForm}
          >
            <div className="w-9 h-9 rounded-md bg-sage flex items-center justify-center border border-sage-border text-forest">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold tracking-tight text-charcoal">
                  OfferProof
                </span>
                <span className="text-[11px] font-medium tracking-wide bg-sage text-forest px-1.5 py-0.5 rounded border border-sage-border">
                  Verification Portal
                </span>
              </div>
              <p className="text-xs text-muted font-normal hidden sm:block">
                Verify before you accept.
              </p>
            </div>
          </div>

          {/* Quick Nav & Helplines */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onScrollToSamples}
              className="hidden md:inline-flex items-center space-x-1.5 text-xs font-medium text-muted hover:text-charcoal px-2.5 py-1.5 rounded-md hover:bg-neutral-subtle transition"
            >
              <span>Test Scenarios</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-charcoal px-3 py-1.5 rounded-md border border-neutral-border hover:bg-neutral-subtle transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-muted" />
              <span>Safety Guide</span>
            </button>

            <button
              onClick={onScrollToForm}
              className="inline-flex items-center space-x-1.5 text-xs font-medium bg-forest hover:bg-forest-700 text-white px-3.5 py-1.5 rounded-md transition shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Verify Offer</span>
            </button>

            {/* National Helpline Badge */}
            <a
              href="tel:1930"
              title="National Cyber Crime Reporting Helpline"
              className="hidden lg:flex items-center space-x-1.5 text-xs font-medium bg-warm text-charcoal border border-neutral-border px-2.5 py-1.5 rounded-md hover:border-muted transition"
            >
              <PhoneCall className="w-3 h-3 text-muted" />
              <span>Helpline: 1930</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
