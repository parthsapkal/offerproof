'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, ArrowRight, Lock, CheckCircle2, IndianRupee } from 'lucide-react';

interface HeroProps {
  onScrollToForm: () => void;
  onScrollToSamples: () => void;
}

export function Hero({ onScrollToForm, onScrollToSamples }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-navy-800">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-teal-500/10 via-amber-500/5 to-teal-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-navy-800/80 border border-navy-700/80 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-teal-300 mb-6 backdrop-blur-sm shadow-inner">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>India-Focused Internship Offer Verification Assistant</span>
          </div>

          {/* Main Title with Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Verify before <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-200 to-amber-300">
              you accept.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-navy-200 leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
            Thousands of Indian college students fall prey each year to fake internship letters, upfront{' '}
            <span className="text-amber-300 font-semibold">\u20B92,000–\u20B910,000 "registration fees"</span>, and Telegram task scams.
            OfferProof evaluates recruiter credentials, domain authenticity, and offer clauses with explainable rules.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={onScrollToForm}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-7 py-3.5 rounded-xl text-base shadow-xl shadow-teal-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Analyze an Offer Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onScrollToSamples}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-navy-800/90 hover:bg-navy-700/90 text-white font-semibold px-6 py-3.5 rounded-xl text-base border border-navy-700 transition"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Explore Judge Sample Cases</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-navy-800/80 text-left">
            <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-navy-900/60 border border-navy-800">
              <IndianRupee className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Zero Fee Rule</p>
                <p className="text-[11px] text-navy-300">Legit internships never charge students</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-navy-900/60 border border-navy-800">
              <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Domain Spoof Check</p>
                <p className="text-[11px] text-navy-300">Detects lookalikes & free email traps</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-navy-900/60 border border-navy-800">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Deterministic Rules</p>
                <p className="text-[11px] text-navy-300">No fabricated % or black-box guessing</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-navy-900/60 border border-navy-800">
              <Lock className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">100% Private</p>
                <p className="text-[11px] text-navy-300">Files parsed in memory; zero storage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
