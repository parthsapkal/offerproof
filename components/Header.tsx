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
    <header className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-md border-b border-navy-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onScrollToForm}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-2 ring-teal-300/30">
              <ShieldCheck className="w-6 h-6 text-navy-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Offer<span className="text-teal-400">Proof</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-900/60 text-teal-300 border border-teal-700/60 px-1.5 py-0.5 rounded">
                  India Beta
                </span>
              </div>
              <p className="text-xs text-navy-300 font-medium hidden sm:block">
                Verify before you accept.
              </p>
            </div>
          </div>

          {/* Quick Nav & Helplines */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onScrollToSamples}
              className="hidden md:inline-flex items-center space-x-1.5 text-xs lg:text-sm font-medium text-navy-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-navy-800/60 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sample Cases</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="inline-flex items-center space-x-1.5 text-xs lg:text-sm font-medium text-teal-300 hover:text-teal-200 px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-800/80 hover:bg-teal-900/50 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Scam Guide</span>
            </button>

            <button
              onClick={onScrollToForm}
              className="inline-flex items-center space-x-1.5 text-xs lg:text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-navy-950 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg transition shadow-md shadow-teal-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>Verify Offer</span>
            </button>

            {/* National Helpline Badge */}
            <a
              href="tel:1930"
              title="National Cyber Crime Reporting Helpline"
              className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800/80 px-2.5 py-1.5 rounded-lg hover:bg-red-900/60 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Cyber Helpline: 1930</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
